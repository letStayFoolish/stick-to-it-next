import React from "react";
import { getTranslations } from "next-intl/server";
import ProductCard from "@/components/Product/ProductCard";
import NoData from "@/components/ui/NoData";
import type { ProductPlain } from "@/lib/types";

type Props = {
  categories: Record<string, ProductPlain[]> | undefined;
};
const Categories: React.FC<Props> = async ({ categories }) => {
  if (!categories || Object.keys(categories).length === 0) {
    const t = await getTranslations("Products");
    return <NoData text={t("noProductsFound")} />;
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
