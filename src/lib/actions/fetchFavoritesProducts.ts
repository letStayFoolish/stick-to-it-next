"use server";

import { getUserData as getUserDataAction } from "@/lib/actions/getUserData";
import { fetchProducts as fetchProductsAction } from "@/lib/actions/fetchProducts";

export async function fetchFavoritesProducts() {
  try {
    // Fetch the user's liked items (IDs of favorite products)
    const userData: { likedItems: string[] } =
      await getUserDataAction("likedItems");

    console.log({ userData });

    const favoriteProducts: string[] = userData?.likedItems?.map(String) || []; // Ensure it's an array of strings

    if (favoriteProducts.length === 0) return []; // User has no liked items

    const allProducts = await fetchProductsAction();

    if (!allProducts || allProducts.length === 0) return [];

    const filteredProducts = allProducts.filter((product) =>
      favoriteProducts.includes(String(product._id)),
    );

    const enrichedProducts = filteredProducts?.map((product) => ({
      ...product,
      _id: String(product._id),
    }));

    return enrichedProducts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the products for specific category.");
  }
}
