import React from "react";
import NoData from "@/components/ui/NoData";
import ProductItem from "@/components/Product/ProductItem";
import { fetchProductsFromCategory as fetchProductsFromCategoryAction } from "@/lib/actions/fetchProductsFromCategory";

type Props = {
  selectedCategory: string;
};

const ProductList: React.FC<Props> = async ({ selectedCategory }) => {
  const products = await fetchProductsFromCategoryAction(selectedCategory);

  if (!products || products.length === 0) {
    return <NoData text={"No products found"} />;
  }

  return (
    <div className="flex flex-col w-full lg:w-2/4 my-4">
      <ul className="mx-auto w-full">
        {products?.map((product) => (
          <li
            className="border-b border-border last:border-none p-2 w-full"
            key={product._id}
          >
            <ProductItem product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
