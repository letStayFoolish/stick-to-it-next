"use server";

import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";
import { cache } from "react";

/**
 * If you are not using fetch, and instead using an ORM or database directly,
 * you can wrap your data fetch with the React cache function.
 * This will de-duplicate and only make one query.
 */
export const fetchAllCategories = cache(async () => {
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
});
