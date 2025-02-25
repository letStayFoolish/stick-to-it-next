import React from "react";
import ProductCard from "@/components/Product/ProductCard";
import NoData from "@/components/ui/NoData";
import type { ProductPlain } from "@/lib/types";

type Props = {
  categories: Record<string, ProductPlain[]> | undefined;
};
const Categories: React.FC<Props> = ({ categories }) => {
  if (!categories || Object.keys(categories).length === 0) {
    return <NoData text={"No products found"} />;
  }

  return (
    <div className="grid grid-cols-2 m-auto md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-8 mb-4 mt-16 lg:mb-12">
      {Object.entries(categories).map(([key, products]) => (
        <ProductCard key={key} product={products[0]} />
      ))}
    </div>
  );
};

export default Categories;
