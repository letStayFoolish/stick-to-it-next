"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as shoppingListService from "@/lib/services/shoppingListService";

export type NotesActionState = {
  success: boolean;
  message?: string;
};

export async function updateNotes(
  prevState: NotesActionState | undefined,
  formData: FormData,
): Promise<NotesActionState> {
  try {
    const notes = (formData.get("notes") as string) ?? "";

    const auth = await requireUser();

    if (!auth.authenticated) {
      return { success: false, message: "Not authenticated" };
    }

    await connectDB();

    await shoppingListService.setNotes(auth.userId, notes);

    revalidatePath("/shopping-list");

    return { success: true };
  } catch (error) {
    console.error("Failed to update notes:", error);

    return {
      success: false,
      message: "Failed to save your note. Please try again.",
    };
  }
}
