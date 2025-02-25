"use server";

import { fetchProducts as fetchProductsAction } from "@/lib/actions/fetchProducts";
import { fetchAllCategories as fetchAllCategoriesAction } from "@/lib/actions/fetchAllCategories";
import type { ProductPlain } from "@/lib/types";

export async function getSortedProducts() {
  try {
    const [allProducts, categories] = await Promise.all([
      fetchProductsAction(),
      fetchAllCategoriesAction(),
    ]);

    if (!allProducts || allProducts.length === 0) {
      throw new Error("No products found");
    }

    if (!categories || categories.length === 0) {
      throw new Error("No categories found");
    }

    const productsSortedByCategory: Record<string, ProductPlain[]> = {};

    categories.forEach((category: string) => {
      productsSortedByCategory[category] = allProducts.filter(
        (product) => product.category === category,
      );
    });

    return productsSortedByCategory;
  } catch (error) {
    console.log(error);
  }
}
