"use client";

import React, { useEffect, useState } from "react";
import NoData from "@/components/ui/NoData";
import ProductItem from "@/components/Product/ProductItem";
import { fetchProductsFromCategory } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { ProductPlain } from "@/lib/types";

type Props = {
  // products: ProductPlain[];
  selectedCategory: string;
};

const ProductList: React.FC<Props> = ({ selectedCategory }) => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<ProductPlain[] | []>([]);

  // const products = use(awaitedProducts);

  useEffect(() => {
    void (async () => {
      try {
        const userEmail = session?.user?.email ?? "";

        const awaitedProducts = await fetchProductsFromCategory(
          selectedCategory,
          userEmail as string,
        ); // await here or pass promise as props to a client component, and use them using React's `use` hook.

        if (awaitedProducts) setProducts(awaitedProducts);
        else setProducts([]);
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, [session, selectedCategory]);

  return (
    <div className="flex flex-col w-full md:w-1/2 my-4">
      {products?.length === 0 && <NoData text={"No Data"} />}
      <ul>
        {products?.map((product) => (
          <li
            className="border-b border-border last:border-none mb-2 p-2"
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
