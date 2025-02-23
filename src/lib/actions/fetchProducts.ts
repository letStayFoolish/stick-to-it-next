"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";
import { ProductPlain } from "@/lib/types";

export async function fetchProducts() {
  try {
    if (!mongoose.connection.readyState) {
      await connectDB();
    }

    const products = await ProductSchema.find({}).lean<ProductPlain[]>();

    if (!products || products.length === 0) {
      // Error("No products found");
      return [];
    }

    return products;
  } catch (error) {
    console.log(error);
  }
}
