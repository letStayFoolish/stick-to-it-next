import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import GoToPage from "@/components/GoToPage";
import PageHeading from "@/components/PageHeading";
import ListDynamicData from "@/app/(private)/shopping-list/components/ListDynamicData";

export const metadata: Metadata = {
  title: "Shopping List",
};

export const dynamic = "force-dynamic";

const ShoppingList: React.FC = async () => {
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
          <div className="flex gap-4 items-center justify-center">
            Loading Shopping List Items...
            <LoadingSpinner />
          </div>
        }
      >
        <ListDynamicData />
      </Suspense>
    </div>
  );
};

export default ShoppingList;
