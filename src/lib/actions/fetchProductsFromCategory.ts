"use server";

import { ProductPlain } from "@/lib/types";
import connectDB from "@/lib/database";
import { getUser } from "@/lib/dal";
import * as productService from "@/lib/services/productService";
import { cache } from "react";

export const fetchProductsFromCategory = cache(
  async (categoryName: string): Promise<ProductPlain[]> => {
    try {
      await connectDB();

      const user = await getUser();
      const userId = user?._id?.toString() ?? null;

      const products = await productService.getVisibleProductsByCategory(
        userId,
        categoryName,
      );

      if (!products) {
        return [];
      }

      const likedItems: string[] = user?.likedItems?.map(String) ?? [];

      // Add 'isLiked' flag to products based on likedItems
      const enrichedProducts = products.map((product) => ({
        ...product,
        _id: String(product._id),
        isLiked: likedItems.includes(String(product._id)),
      }));

      // Sort by liked status, then alphabetical order
      return enrichedProducts.sort((a, b) => {
        if (a.isLiked && !b.isLiked) return -1; // Liked products first
        if (!a.isLiked && b.isLiked) return 1;
        if (a.product_name < b.product_name) return -1; // A-Z sorting
        if (a.product_name > b.product_name) return 1;
        return 0;
      });
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch the products for specific category.");
    }
  },
);
