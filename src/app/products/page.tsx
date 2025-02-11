import React from "react";
import type { Metadata } from "next";
import Categories from "@/app/products/Categories";

export const metadata: Metadata = {
  title: "All Products",
};

const AllProducts: React.FC = () => {
  return (
    <main className="flex flex-col items-center p-4">
      <div className="mb-6 text-center">
        <h1 className="font-bold text-3xl md:text-4xl mb-2 drop-shadow-md">
          Explore All Products
        </h1>
      </div>
      <Categories />
    </main>
  );
};

export default AllProducts;
