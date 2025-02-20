import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ShoppingList as List } from "./components/ShoppingList";
import { fetchShoppingListItems } from "@/lib/actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import GoToPage from "@/components/GoToPage";
import { FaCartShopping, FaShare } from "react-icons/fa6";
import PageHeading from "@/components/PageHeading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Shopping List",
};

export const dynamic = "force-dynamic";

const ShoppingList: React.FC = async () => {
  const fetchedProducts = await fetchShoppingListItems();

  if (!fetchedProducts || fetchedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center p-4">
        <div className="mb-4 px-3 py-4 text-center">
          <h2 className="font-extrabold text-start text-2xl md:text-3xl text-primary uppercase drop-shadow-md">
            Shopping List is Empty
          </h2>
        </div>
        <FaCartShopping className="text-primary text-6xl mb-12" />
        <GoToPage
          className="bg-secondary px-4 py-3 mb-6 md:mb-2 rounded-md hover:opacity-80 transition-opacity flex items-center w-fit"
          href={"/products"}
        >
          Browse Products
        </GoToPage>
      </div>
    );
  }

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
        <List products={fetchedProducts || []} />
      </Suspense>
    </div>
  );
};

export default ShoppingList;
