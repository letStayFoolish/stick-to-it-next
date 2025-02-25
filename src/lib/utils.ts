import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product as ProductType, ProductPlain } from "@/lib/types";
import { fetchProducts as fetchProductsAction } from "@/lib/actions/fetchProducts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert _id (type ObjectId) and any problematic fields to plain values
export const convertObjectIdToPlainValues = <T extends ProductType>(
  items: T[],
) => {
  return items.map((item) => ({
    ...item,
    _id: item._id.toString(), // Ensure _id is now a string
  }));
};

export async function getLimitedNumberOfProducts(limit: number) {
  const allProducts = await fetchProductsAction();

  if (!allProducts) return;

  const categorySet = new Set<string>();

  const selectedProducts: ProductPlain[] = [];

  try {
    /**
     * Here we create an array `selectedProducts` with one (first from the array) Product for each category
     * Also We create a set array `categorySet` of categories with the length of `limit` what we set
     *
     */
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

export const handleSpacesInProductName = (value: any) => {
  if (value.includes(" ")) {
    return value.split(" ").join("").trim();
  }

  return value.trim();
};

export const handleProductName = (value: any) => {
  if (value.includes("-")) {
    return value.split("-").join(", ");
  }

  return value as string;
};
