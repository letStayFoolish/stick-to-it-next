"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import FormError from "@/components/Form/FormError";
import CategoryIcon from "@/components/CategoryIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import type { ProductPlain } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  updateOwnedItem as updateOwnedItemAction,
  deleteOwnedItem as deleteOwnedItemAction,
} from "@/lib/actions/myItems";

type Props = {
  product: ProductPlain;
};

const MyItemRow: React.FC<Props> = ({ product }) => {
  const t = useTranslations("Profile");
  const tCategories = useTranslations("Categories");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState<string>(product.category);

  const [updateState, updateFormAction, isUpdatePending] = useActionState(
    updateOwnedItemAction,
    { success: false },
  );
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteOwnedItemAction,
    { success: false },
  );

  useEffect(() => {
    if (updateState.success) {
      setDialogOpen(false);
    }
  }, [updateState]);

  return (
    <TableRow>
      <TableCell className="hidden md:block">{product._id}</TableCell>
      <TableCell>{product.product_name}</TableCell>
      <TableCell>
        <Link
          href={`/products/${product.category}`}
          className="text-accent-foreground font-bold hover:underline"
        >
          {tCategories(product.category)}
        </Link>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-4 justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                aria-label={t("editItemLabel", { name: product.product_name })}
              >
                <FaEdit />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("editItem")}</DialogTitle>
              </DialogHeader>
              <form action={updateFormAction} className="flex flex-col gap-4">
                <input type="hidden" name="product_id" value={product._id} />
                <input type="hidden" name="category" value={category} />

                <Input
                  name="name"
                  defaultValue={product.product_name}
                  maxLength={60}
                  required
                  aria-label={t("itemNameLabel")}
                  disabled={isUpdatePending}
                />

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
                        <CategoryIcon
                          category={value}
                          size="sm"
                          className="size-6"
                        />
                        {tCategories(value)}
                      </button>
                    );
                  })}
                </div>

                <Button type="submit" disabled={isUpdatePending}>
                  {isUpdatePending ? <LoadingSpinner /> : t("saveChanges")}
                </Button>

                <FormError message={updateState.message} />
              </form>
            </DialogContent>
          </Dialog>

          <form action={deleteFormAction}>
            <input type="hidden" name="product_id" value={product._id} />
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              disabled={isDeletePending}
              aria-label={t("deleteItemLabel", { name: product.product_name })}
            >
              {isDeletePending ? <LoadingSpinner /> : <Trash2 size={18} />}
            </Button>
            <FormError message={deleteState.message} />
          </form>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MyItemRow;
