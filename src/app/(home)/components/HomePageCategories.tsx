import React from "react";
import { getLimitedNumberOfProducts } from "@/lib/utils";
import ProductCard from "@/components/Product/ProductCard";

const HomePageCategories: React.FC = async () => {
  const selectedProducts = await getLimitedNumberOfProducts(6);

  if (!selectedProducts?.length) {
    return <p>No products to be shown!</p>;
  }

  return (
    <section className="grid grid-cols-2 m-auto md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-8 mb-4 mt-16 lg:mb-12">
      {selectedProducts &&
        selectedProducts.map((product) => (
          <ProductCard key={product._id.toString()} product={product} />
        ))}
    </section>
  );
};

export default HomePageCategories;
