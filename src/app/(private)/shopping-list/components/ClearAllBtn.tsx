"use client";

import { Button } from "@/components/ui/button";
import React, { ButtonHTMLAttributes, useActionState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { clearProducts as clearProductsAction } from "@/lib/actions/clearProducts";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const ClearAll: React.FC<Props> = ({ className, ...props }) => {
  const t = useTranslations("ShoppingListPage");
  const classes = cn(
    "hover:opacity-80 hover:text-opacity-80 transition-all",
    className,
  );

  const [state, formAction, isPending] = useActionState(clearProductsAction, {
    message: "",
    success: false,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="action" value="clear-all" />

      <Button
        disabled={isPending}
        variant={"destructive"}
        className={classes}
        {...props}
      >
        {isPending ? `Clearing...` : t("clearList")}
      </Button>

      <p className="sr-only" aria-live="polite" role="status">
        {state?.message}
      </p>
    </form>
  );
};

export default ClearAll;
