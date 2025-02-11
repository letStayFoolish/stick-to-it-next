import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fetchAllCategories, fetchAllProducts } from "@/lib/actions";
import type { Product as ProductType } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getLimitedNumberOfProducts(limit: number) {
  const allProducts = await fetchAllProducts();

  if (!allProducts) return;

  const categorySet = new Set<string>();

  const selectedProducts: ProductType[] = [];

  try {
    for (const product of allProducts) {
      if (!categorySet.has(product.category)) {
        categorySet.add(product.category);
        selectedProducts.push(product);
      }
      if (selectedProducts.length >= limit) break;
    }

    return selectedProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function getSortedProducts() {
  try {
    const [allProducts, categories] = await Promise.all([
      fetchAllProducts(),
      fetchAllCategories(),
    ]);

    if (!allProducts || allProducts.length === 0) {
      throw new Error("No products found");
    }

    if (!categories || categories.length === 0) {
      throw new Error("No categories found");
    }

    const productsSortedByCategory: Record<string, ProductType[]> = {};

    categories.forEach((category: string) => {
      productsSortedByCategory[category] = allProducts.filter(
        (product: ProductType) => product.category === category,
      );
    });

    return productsSortedByCategory;
  } catch (error) {
    console.log(error);
  }
}

export const handleSpacesInProductName = (value: any) => {
  if (value.includes(" ")) {
    return value.split(" ").join("").trim();
  }

  return value.trim();
};
