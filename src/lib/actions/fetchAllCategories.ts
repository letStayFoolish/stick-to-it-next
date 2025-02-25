"use server";

import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";

export async function fetchAllCategories() {
  try {
    await connectDB();

    const categories =
      await ProductSchema.distinct("category").lean<string[]>();

    if (!categories || categories.length === 0) return [];

    return categories;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
}
