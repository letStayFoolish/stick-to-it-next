import React from "react";
import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import Categories from "@/app/products/components/Categories";

export const metadata: Metadata = {
  title: "All Products",
};

const AllProducts: React.FC = () => {
  return (
    <main className="flex flex-col items-center p-4">
      <div className="mb-6 text-center">
        <PageHeading>All Products</PageHeading>
      </div>
      <Categories />
    </main>
  );
};

export default AllProducts;
