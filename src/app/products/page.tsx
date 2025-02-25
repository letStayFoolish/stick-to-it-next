import React, { Suspense } from "react";
import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import Categories from "@/app/products/components/Categories";
import { getSortedProducts as getSortedProductsAction } from "@/lib/actions/getSortedProducts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "All Products",
};

const AllProducts: React.FC = async () => {
  const productsByCategory = await getSortedProductsAction();

  return (
    <main className="flex flex-col items-center p-4">
      <div className="mb-6 text-center">
        <PageHeading>All Products</PageHeading>
      </div>
      <Suspense
        fallback={
          <div className="flex gap-4 items-center justify-center">
            Loading Products...
            <LoadingSpinner />
          </div>
        }
      >
        <Categories categories={productsByCategory} />
      </Suspense>
    </main>
  );
};

export default AllProducts;
