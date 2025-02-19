import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ShoppingList as List } from "./components/ShoppingList";
import { fetchShoppingListItems } from "@/lib/actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Shopping List",
};

export const dynamic = "force-dynamic";

const ShoppingList: React.FC = async () => {
  const fetchedProducts = await fetchShoppingListItems();

  return (
    <main className="flex flex-col items-center p-4">
      <h2 className="font-extrabold text-start text-2xl md:text-3xl text-primary uppercase drop-shadow-md">
        Shopping List
      </h2>
      <Suspense
        fallback={
          <>
            Loading Shopping List Items...
            <LoadingSpinner />
          </>
        }
      >
        <List products={fetchedProducts || []} />
      </Suspense>
    </main>
  );
};

export default ShoppingList;
