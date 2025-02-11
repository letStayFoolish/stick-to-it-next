import React from "react";
import { getSortedProducts } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

const Categories: React.FC = async () => {
  const productsByCategory = await getSortedProducts();

  if (!productsByCategory || Object.keys(productsByCategory).length === 0) {
    return <p>No Products</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 gap-2 md:gap-4 lg:gap-6 mb-4 lg:mb-12">
      {Object.entries(productsByCategory).map(([key, products]) => (
        <ProductCard key={key} product={products[0]} />
      ))}
    </div>
  );
};

export default Categories;
