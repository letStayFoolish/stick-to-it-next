"use server";

import { getLocale } from "next-intl/server";
import type { Locale } from "@/lib/locale";
import { getUser } from "@/lib/dal";
import * as productService from "@/lib/services/productService";
import { cache } from "react";

/**
 * https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 *
 * Server Actions are not limited to <form> and can be invoked from event handlers, useEffect, third-party libraries, and other form elements like <button>.
 *
 * Server Actions integrate with the Next.js caching and revalidation architecture. When an action is invoked,
 * Next.js can return both the updated UI and new data in a single server roundtrip.
 *
 * Behind the scenes, actions use the POST method, and only this HTTP method can invoke them.
 *
 * Server Actions are functions. This means they can be reused anywhere in your application.
 *
 */
export const fetchShoppingListItems = cache(async () => {
  try {
    const user = await getUser();

    if (!user) return;

    // Extract the product IDs from the user's shopping list
    const productIds = user.listItems?.map((item: any) =>
      item.productId.toString(),
    );

    const locale = (await getLocale()) as Locale;

    // Query the database for products matching these IDs
    const products = await productService.getVisibleProductsByIds(
      user._id.toString(),
      productIds,
      locale,
    );

    // Enrich the products with quantities from the shopping list
    const enrichedProducts = products.map((product) => {
      const matchingItem = user.listItems.find(
        (item: any) => item.productId.toString() === product._id.toString(),
      );
      return {
        ...product,
        _id: product._id.toString(),
        quantity: matchingItem?.quantity || 0,
        checked: matchingItem?.checked ?? false,
      };
    });

    return enrichedProducts;
  } catch (error: any) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the shopping list products.");
  }
});
