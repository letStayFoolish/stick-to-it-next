"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateNotes as updateNotesAction } from "@/lib/actions/updateNotes";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormError from "@/components/Form/FormError";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NotebookPen } from "lucide-react";

type Props = {
  initialNotes: string;
};

const TripMemo: React.FC<Props> = ({ initialNotes }) => {
  const t = useTranslations("ShoppingListPage");
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [draft, setDraft] = useState(initialNotes);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(updateNotesAction, {
    success: false,
  });

  useEffect(() => {
    setSavedNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    if (state.success) {
      setSavedNotes(draft);
      setIsEditing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(savedNotes);
          setIsEditing(true);
        }}
        className="w-full flex items-start gap-3 mt-10 px-3 py-4 bg-muted dark:bg-background rounded-md shadow-sm text-left"
      >
        <NotebookPen className="shrink-0 mt-0.5 text-muted-foreground" size={18} />
        {savedNotes ? (
          <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
            {savedNotes}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("memoPlaceholder")}
          </p>
        )}
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full flex flex-col gap-3 mt-10 px-3 py-4 bg-muted dark:bg-background rounded-md shadow-sm"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          formRef.current?.requestSubmit();
        }
      }}
    >
      <Textarea
        name="notes"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t("memoPlaceholder")}
        rows={4}
        autoFocus
        disabled={isPending}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? <LoadingSpinner /> : t("memoDone")}
      </Button>

      {!state.success && <FormError message={state.message} />}
    </form>
  );
};

export default TripMemo;
