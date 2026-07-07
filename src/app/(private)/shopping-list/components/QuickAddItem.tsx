"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CATEGORIES } from "@/lib/types";
import { handleProductName } from "@/lib/utils";
import { quickAddItem as quickAddItemAction } from "@/lib/actions/quickAddItem";
import CategoryIcon from "@/components/CategoryIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/Form/FormError";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORY = "else";

const QuickAddItem: React.FC = () => {
  const t = useTranslations("ShoppingListPage");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [state, formAction, isPending] = useActionState(quickAddItemAction, {
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setCategory(DEFAULT_CATEGORY);
      toast({ title: t("quickAddToast") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full min-w-0 flex flex-col gap-3 mt-4 px-3 py-4 bg-muted dark:bg-background rounded-md shadow-sm"
    >
      <input type="hidden" name="category" value={category} />

      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((value) => {
          const isSelected = value === category;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setCategory(value)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm whitespace-nowrap border transition-colors",
                isSelected
                  ? "bg-primary text-accent-ink border-primary"
                  : "bg-transparent border-border text-muted-foreground hover:bg-secondary",
              )}
            >
              <CategoryIcon category={value} size="sm" className="size-6" />
              {handleProductName(value)}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Input
          name="name"
          placeholder={t("quickAddPlaceholder")}
          maxLength={60}
          required
          disabled={isPending}
          aria-label="Item name"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <LoadingSpinner /> : t("quickAddButton")}
        </Button>
      </div>

      {!state.success && <FormError message={state.message} />}
    </form>
  );
};

export default QuickAddItem;
