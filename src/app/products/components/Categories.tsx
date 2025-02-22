import React from "react";
import { getSortedProducts } from "@/lib/utils";
import ProductCard from "@/components/Product/ProductCard";
import NoData from "@/components/ui/NoData";

const Categories: React.FC = async () => {
  const productsByCategory = await getSortedProducts();

  if (!productsByCategory || Object.keys(productsByCategory).length === 0) {
    return <NoData text={"No products found"} />;
  }

  return (
    <div className="grid grid-cols-2 m-auto md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-8 mb-4 mt-16 lg:mb-12">
      {Object.entries(productsByCategory).map(([key, products]) => (
        <ProductCard key={key} product={products[0]} />
      ))}
    </div>
  );
};

export default Categories;
