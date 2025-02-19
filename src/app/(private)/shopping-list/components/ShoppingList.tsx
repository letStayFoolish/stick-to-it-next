"use client";

import React, { useCallback } from "react";
import NoData from "@/components/ui/NoData";
import type { ProductPlain } from "@/lib/types";
import Image from "next/image";
import { handleProductName } from "@/lib/utils";
import ClearAllBtn from "@/app/(private)/shopping-list/components/ClearAllBtn";
import Link from "next/link";
import ShoppingListItem from "@/app/(private)/shopping-list/components/ShoppingListItem";

type Props = {
  products: ProductPlain[];
};
export const ShoppingList: React.FC<Props> = ({ products }) => {
  // Group items by category
  const groupByCategory = useCallback((items: ProductPlain[]) => {
    return items.reduce((acc: Record<string, ProductPlain[]>, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, []);

  if (products && products.length === 0) {
    return (
      <NoData text={"Add items to your shopping list to see them here!"} />
    );
  }

  const groupedItems = products ? groupByCategory(products) : {};

  return (
    <section className="">
      <ul className="w-full flex flex-col items-start mt-2 md:mt-6 px-3 pt-4 pb-6 bg-muted dark:bg-background rounded-md shadow-sm">
        {Object.entries(groupedItems).map(([categoryName, products]) => (
          <li className="w-full" key={categoryName}>
            <div className="flex gap-4 lg:gap-7 items-baseline border-b-2 border-border last:border-none py-2 lg:py-3">
              <Link href={`/products/${categoryName}`}>
                <Image
                  src={`/images/categories/${categoryName}.png`} // Assuming category image exists in the product
                  alt={`Image for the groceries from the category ${categoryName}`}
                  width={50}
                  height={50}
                  priority={true}
                  className="object-cover object-center lg:w-[80px]"
                />
              </Link>
              <h3 className="uppercase text-lg md:text-xl font-medium lg:font-bold">
                {handleProductName(categoryName)}
              </h3>
            </div>
            <ul className="w-full">
              {products.map((product) => (
                <li
                  key={product._id.toString()}
                  className="border-b last:border-none"
                >
                  <ShoppingListItem product={product} />
                </li>
              ))}
            </ul>
            {/* Product Rows */}
          </li>
        ))}
      </ul>
      <ClearAllBtn />
    </section>
  );
};
