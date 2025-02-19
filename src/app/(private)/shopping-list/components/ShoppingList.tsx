"use client";

import React, { useCallback } from "react";
import NoData from "@/components/ui/NoData";
import type { ProductPlain } from "@/lib/types";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { handleProductName } from "@/lib/utils";
import RemoveFromListBtn from "@/app/(private)/shopping-list/components/RemoveFromListBtn";

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
    <section className="mt-6 w-full lg:w-2/3">
      <div className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        {Object.entries(groupedItems).map(([categoryName, products]) => (
          <React.Fragment key={categoryName}>
            {/* Category Row (Heading) */}
            <div className="bg-gray-100 dark:bg-gray-800">
              <div className="py-2 px-4 sm:px-6 font-semibold text-gray-800 dark:text-gray-100">
                <div className="flex items-center gap-4">
                  <Image
                    src={`/images/categories/${products[0].category}.png`} // Assuming category image exists in the product
                    alt={`${categoryName} Image`}
                    className="w-12 h-12 rounded-md object-cover"
                    width={48}
                    height={48}
                    priority
                  />
                  <span className="text-lg">
                    {handleProductName(categoryName)}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Rows */}
            {products.map((product) => (
              <div
                key={product._id.toString()}
                className="px-4 flex items-center justify-between"
              >
                <div className="flex gap-6 space-x-2">
                  <Checkbox id={`row-${product._id}`} className="peer" />
                  <label
                    htmlFor={`row-${product._id}`}
                    className="text-sm font-light leading-none peer-checked:line-through peer-checked:text-gray-500"
                  >
                    {product.product_name}
                  </label>
                </div>
                <div className="table-cell py-3 px-4 sm:px-6 text-right">
                  <RemoveFromListBtn productId={product._id} />
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
