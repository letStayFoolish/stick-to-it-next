import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ShoppingList as List } from "./components/ShoppingList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import GoToPage from "@/components/GoToPage";
import PageHeading from "@/components/PageHeading";
import { fetchShoppingListItems as fetchShoppingListItemsAction } from "@/lib/actions/fetchShoppingListItems";
import EmptyShoppingList from "@/app/(private)/shopping-list/components/EmptyShoppingList";

export const metadata: Metadata = {
  title: "Shopping List",
};

export const dynamic = "force-dynamic";

const ShoppingList: React.FC = async () => {
  const fetchedProducts = await fetchShoppingListItemsAction();

  if (fetchedProducts?.length === 0) return <EmptyShoppingList />;

  return (
    <div className="flex flex-col p-4 w-full md:w-2/3 md:mx-auto">
      <div className="mb-4 px-3 py-4 text-center flex justify-center">
        <PageHeading>Shopping List</PageHeading>
      </div>
      <div className="w-full flex justify-between">
        <GoToPage
          className="bg-secondary px-4 py-3 mb-6 md:mb-2 rounded-md hover:opacity-80 transition-opacity flex items-center w-fit"
          href={"/"}
        >
          Go Home
        </GoToPage>
        <GoToPage
          className="bg-secondary px-4 py-3 mb-6 md:mb-2 rounded-md hover:opacity-80 transition-opacity flex items-center w-fit"
          href={"/products"}
        >
          Browse Products
        </GoToPage>
      </div>
      <Suspense
        fallback={
          <>
            Loading Shopping List Items...
            <LoadingSpinner />
          </>
        }
      >
        <List products={fetchedProducts ?? []} />
      </Suspense>
    </div>
  );
};

export default ShoppingList;
