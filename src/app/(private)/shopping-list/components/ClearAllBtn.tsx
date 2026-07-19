"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ButtonHTMLAttributes, useActionState, useState } from "react";
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(clearProductsAction, {
    message: "",
    success: false,
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          variant={"destructive"}
          className={classes}
          {...props}
        >
          {isPending ? t("clearing") : t("clearList")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("clearListConfirmTitle")}</DialogTitle>
          <DialogDescription>
            {t("clearListConfirmDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-6 sm:gap-0">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            {t("clearListConfirmCancel")}
          </Button>

          <form action={formAction} onSubmit={() => setDialogOpen(false)}>
            <input type="hidden" name="action" value="clear-all" />
            <Button
              type="submit"
              disabled={isPending}
              variant="destructive"
              className="w-full"
            >
              {isPending ? t("clearing") : t("clearListConfirmAction")}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>

      <p className="sr-only" aria-live="polite" role="status">
        {state?.message}
      </p>
    </Dialog>
  );
};

export default ClearAll;
