import React from "react";
import { getLimitedNumberOfProducts } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

const HomePageCategories: React.FC = async () => {
  const selectedProducts = await getLimitedNumberOfProducts(6);

  if (!selectedProducts?.length) {
    return <p>No products to be shown!</p>;
  }

  return (
    <section className="grid grid-cols-2 w-full md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 mt-16 lg:mb-12">
      {selectedProducts &&
        selectedProducts.map((product) => (
          <ProductCard key={product._id.toString()} product={product} />
        ))}
    </section>
  );
};

export default HomePageCategories;
