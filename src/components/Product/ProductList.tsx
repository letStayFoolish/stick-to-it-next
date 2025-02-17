"use client";

import React, { useEffect, useState } from "react";
import NoData from "@/components/ui/NoData";
import ProductItem from "@/components/Product/ProductItem";
import { fetchProductsFromCategory } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { ProductPlain } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type Props = {
  selectedCategory: string;
};

const ProductList: React.FC<Props> = ({ selectedCategory }) => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<ProductPlain[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    void (async () => {
      let awaitedProducts = [];

      setLoading(true);

      try {
        if (session) {
          const userEmail = session?.user?.email;

          awaitedProducts = await fetchProductsFromCategory(
            selectedCategory,
            userEmail as string,
          ); // await here or pass promise as props to a client component, and use them using React's `use` hook.
        } else {
          awaitedProducts = await fetchProductsFromCategory(selectedCategory);
        }

        if (!awaitedProducts) return;

        setProducts(awaitedProducts);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, selectedCategory]);

  if (loading) {
    return (
      <div className="flex gap-4 items-center justify-center">
        <LoadingSpinner />
        <p>Loading Products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <NoData text={"No products found"} />;
  }

  return (
    <div className="flex flex-col w-full md:w-1/2 my-4">
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
