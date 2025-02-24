"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/dal";

export async function updateNotes(prevState: any, formData: FormData) {
  try {
    const user = await getUser();

    const notesAction = formData.get("action") as
      | "update-notes"
      | "add-note"
      | "remove-note";
    const notes = formData.get("notes") as string;

    if (!notesAction) {
      throw new Error("Invalid action type");
    }

    if (notesAction === "update-notes") {
      if (!notes) {
        throw new Error("Notes cannot be empty when updating");
      }

      user.notes = notes; // Update notes field
    } else if (notesAction === "add-note") {
      user.notes = notes; // Add new note
    } else if (notesAction === "remove-note") {
      user.notes = ""; // Clear notes
    }

    // Save the user's updated notes to the database
    await user.save();

    revalidatePath("/shopping-list");

    return {
      message:
        notesAction === "remove-note"
          ? "Notes removed successfully"
          : "Notes updated successfully",
      notes,
    };
  } catch (error: any) {
    console.error("Failed to update notes:", error.message);

    return {
      error: error.message,
      message: "Failed to update notes",
      notes: prevState?.notes || "",
    };
  }
}
