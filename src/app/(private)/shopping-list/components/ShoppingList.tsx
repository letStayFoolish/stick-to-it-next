"use client";

import React, { useActionState, useCallback, useState } from "react";
import type { ProductPlain } from "@/lib/types";
import Image from "next/image";
import { handleProductName } from "@/lib/utils";
import ClearAllBtn from "@/app/(private)/shopping-list/components/ClearAllBtn";
import Link from "next/link";
import ShoppingListItem from "@/app/(private)/shopping-list/components/ShoppingListItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FaShare } from "react-icons/fa6";
import { Trash2 } from "lucide-react";
import { updateNotes as updateNotesAction } from "@/lib/actions/updateNotes";

type Props = {
  products: ProductPlain[];
  initialNotes: string;
};

export const ShoppingList: React.FC<Props> = ({ products, initialNotes }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false); // New state for dialog
  const [state, formAction, isPending] = useActionState(updateNotesAction, {
    notes: initialNotes,
    error: "",
    message: "",
  });

  // Group items by category
  const groupByCategory = useCallback((items: ProductPlain[]) => {
    return items.reduce((acc: Record<string, ProductPlain[]>, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, []);

  const groupedItems = products ? groupByCategory(products) : {};

  return (
    <section className="">
      <ul className="relative w-full flex flex-col items-start mt-2 md:mt-6 px-3 pt-4 pb-6 bg-muted dark:bg-background rounded-md shadow-sm">
        <Button
          variant="ghost"
          disabled={true}
          className="absolute top-1 right-1"
        >
          <FaShare /> Share List
        </Button>
        {Object.entries(groupedItems).map(([categoryName, products]) => (
          <li className="w-full" key={categoryName}>
            <div className="flex gap-4 items-end border-b-2 border-border last:border-none py-2 lg:py-3">
              <Link href={`/products/${categoryName}`}>
                <Image
                  src={`/images/categories/${categoryName}.png`}
                  alt={`Image for the groceries from the category ${categoryName}`}
                  width={35}
                  height={35}
                  priority={true}
                  className="object-cover"
                />
              </Link>
              <h3 className="uppercase text-lg md:text-xl font-medium lg:font-bold">
                {handleProductName(categoryName)}
              </h3>
            </div>
            <ul className="w-full">
              {products?.map((product) => (
                <li
                  key={product._id.toString()}
                  className="border-b last:border-none"
                >
                  <ShoppingListItem product={product} />
                </li>
              ))}
            </ul>
          </li>
        ))}
        {isPending && (
          <>
            Loading notes... <LoadingSpinner />
          </>
        )}
        {state.notes && (
          <div className="w-full flex flex-col gap-4 mt-10 bg-secondary/20 dark:bg-secondary/10 border-t-2 py-4 border-border">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                My Notes
              </h2>
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
          </div>
        )}
      </ul>

      <div className="w-full flex justify-between items-center gap-4 mt-12 mb-6">
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
      </div>
    </section>
  );
};
