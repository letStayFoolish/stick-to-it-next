"use client";

import React, { useActionState, useCallback, useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formAction as action } from "@/app/(private)/shopping-list/formAction";
import { Trash2 } from "lucide-react";
import { FaShare } from "react-icons/fa6";

type Props = {
  products: ProductPlain[];
};

export const ShoppingList: React.FC<Props> = ({ products }) => {
  const [userNotes, setUserNotes] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false); // New state for dialog
  const [state, formAction, isPending] = useActionState(action, {
    notes: "",
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

  useEffect(() => {
    const notes = localStorage.getItem("userNotes");
    if (!notes) return;
    setUserNotes(notes);
  }, [state]);

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
              {products.map((product) => (
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
        {userNotes && (
          <div className="w-full flex flex-col gap-4 mt-10 bg-secondary/20 dark:bg-secondary/10 border-t-2 py-4 border-border">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                My Notes
              </h2>
              <Trash2
                onClick={() => {
                  setUserNotes("");
                  localStorage.removeItem("userNotes");
                }}
                size={18}
              />
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              {userNotes.split("\n").map((note, index) => (
                <React.Fragment key={index}>
                  - {note}
                  <br />
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
              <FaEdit /> {userNotes ? "Update Notes" : "Add Notes"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write Your Notes</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="- Write your notes here"
                  defaultValue={userNotes ?? ""}
                />
              </div>
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
            </form>
            {state?.error && <DialogHeader>{state.error}</DialogHeader>}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
