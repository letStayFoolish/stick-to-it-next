"use client";

import React, { useActionState, useState } from "react";
import { updateNotes as updateNotesAction } from "@/lib/actions/updateNotes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import ClearAllBtn from "@/app/(private)/shopping-list/components/ClearAllBtn";

type Props = {
  initialNotes: string;
};

const Notes: React.FC<Props> = ({ initialNotes }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false); // New state for dialog
  const [state, formAction, isPending] = useActionState(updateNotesAction, {
    notes: initialNotes,
    error: "",
    message: "",
  });
  return (
    <>
      {isPending && (
        <>
          Loading notes... <LoadingSpinner />
        </>
      )}

      {state.notes && !isPending && (
        <section className="w-full flex flex-col gap-4 mt-10 px-3 pt-4 pb-6 bg-muted dark:bg-background rounded-md shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-foreground">My Notes</h2>
            <form action={formAction}>
              <input type="hidden" name="action" value="remove-note" />
              <Button
                variant="outline"
                className="flex flex-1 items-center gap-2"
                type="submit"
                disabled={isPending}
              >
                <Trash2 size={18} />
              </Button>

              <p className="sr-only" aria-live="polite" role="status">
                {state?.message}
              </p>
            </form>
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            {state.notes?.split("\n").map((note: string, index: number) => (
              <React.Fragment key={index}>
                {note !== "" && (
                  <>
                    - {note}
                    <br />
                  </>
                )}
              </React.Fragment>
            ))}
          </p>
        </section>
      )}

      <section className="w-full flex justify-between items-center gap-4 mt-12 mb-6">
        <ClearAllBtn className="flex-1" />

        {/*<NotesForm />*/}
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-1 items-center gap-2"
            >
              <FaEdit /> {state.notes ? "Update Notes" : "Add Notes"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write Your Notes</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="flex flex-col gap-4">
              <>
                <input type="hidden" name="action" value="update-notes" />
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="- Write your notes here"
                  defaultValue={state.notes ?? ""}
                  rows={14}
                />
              </>
              <Button
                disabled={isPending}
                type="submit"
                onClick={() => setDialogIsOpen(false)}
              >
                {isPending ? (
                  <>
                    Saving... <LoadingSpinner />
                  </>
                ) : (
                  "Save notes"
                )}
              </Button>

              <p className="sr-only" aria-live="polite" role="status">
                {state?.message}
              </p>
            </form>
            {state?.error && <DialogHeader>{state.error}</DialogHeader>}
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
};

export default Notes;
