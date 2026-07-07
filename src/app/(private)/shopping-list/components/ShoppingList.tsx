"use client";

import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import type { ProductPlain } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import Link from "next/link";
import ShoppingListItem from "@/app/(private)/shopping-list/components/ShoppingListItem";
import { Button } from "@/components/ui/button";
import { FaShare } from "react-icons/fa6";

type Props = {
  products: ProductPlain[];
};

export const ShoppingList: React.FC<Props> = ({ products }) => {
  const t = useTranslations("ShoppingListPage");
  const tCategories = useTranslations("Categories");
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

  const groupedItems = products ? groupByCategory(products) : {};

  return (
    <section className="">
      <ul className="relative w-full flex flex-col items-start mt-2 md:mt-6 px-3 pt-4 pb-6 bg-muted dark:bg-background rounded-md shadow-sm">
        <Button
          variant="ghost"
          disabled={true}
          className="absolute top-1 right-1"
        >
          <FaShare /> {t("shareList")}
        </Button>
        {Object.entries(groupedItems).map(([categoryName, products]) => (
          <li className="w-full" key={categoryName}>
            <div className="flex gap-4 items-end border-b-2 border-border last:border-none py-2 lg:py-3">
              <Link href={`/products/${categoryName}`}>
                <CategoryIcon category={categoryName} size="sm" />
              </Link>
              <h3 className="uppercase text-lg md:text-xl font-medium lg:font-bold">
                {tCategories(categoryName)}
              </h3>
            </div>
            <ul className="w-full">
              {products?.map((product) => (
                <li
                  key={product._id.toString()}
                  className="border-b last:border-none"
                >
                  <ShoppingListItem product={product} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};
