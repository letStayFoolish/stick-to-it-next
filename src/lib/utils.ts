import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAllProducts } from "@/lib/actions";
import type { Product as ProductType } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getLimitedNumberOfProducts(limit: number) {
  const allProducts = await getAllProducts();

  if (!allProducts) {
    throw new Error("No products found");
  }

  const categorySet = new Set<string>();

  const selectedProducts: ProductType[] = [];

  for (const product of allProducts) {
    if (!categorySet.has(product.category)) {
      categorySet.add(product.category);
      selectedProducts.push(product);
    }
    if (selectedProducts.length >= limit) break;
  }

  return selectedProducts;
}
