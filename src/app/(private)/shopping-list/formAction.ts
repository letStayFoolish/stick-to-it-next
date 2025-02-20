export type NotesFormState = {
  notes?: string;
  error?: string;
  message?: string;
};

export async function formAction(state: NotesFormState, formData: FormData) {
  try {
    const userNotes = formData.get("notes") as string;

    localStorage.setItem("userNotes", userNotes);

    if (userNotes === "") {
      localStorage.removeItem("userNotes");
      return {
        notes: "",
        message: "Notes cleared",
        error: "",
      };
    } else {
      return {
        notes: userNotes,
        message: "Notes saved",
        error: "",
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      error: error.message,
      notes: "",
      message: "",
    };
  }
}
