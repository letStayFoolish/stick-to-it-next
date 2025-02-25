"use server";

import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";
import { ProductPlain } from "@/lib/types";

export async function fetchProducts() {
  try {
    await connectDB();

    const products = await ProductSchema.find({}).lean<ProductPlain[]>();

    if (!products || products.length === 0) {
      return [];
    }

    return products;
  } catch (error) {
    console.log(error);
  }
}
