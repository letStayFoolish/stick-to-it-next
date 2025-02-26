"use server";

import { Product as ProductType, ProductPlain } from "@/lib/types";
import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";
import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";
import { cache } from "react";

export const fetchProductsFromCategory = cache(
  async (categoryName: string): Promise<ProductPlain[]> => {
    try {
      await connectDB();

      const products = await ProductSchema.find({
        category: categoryName as string,
      }).lean<ProductType[]>();

      if (!products) {
        return [];
      }

      const userEmail = (await getUser())?.email ?? null;

      let likedItems: string[] = [];

      if (userEmail) {
        const user = await User.findOne({ email: userEmail }).select(
          "likedItems",
        );

        if (user && user.likedItems) {
          likedItems = user.likedItems.map(String); // Convert ObjectId to string for easier comparison
        }
      }

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
