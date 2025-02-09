"use server";

import connectDB from "@/lib/database";
import Product from "@/lib/schema/Product";
import type { Product as ProductType } from "@/lib/types";

export async function getAllProducts() {
  try {
    await connectDB();

    const products: ProductType[] = await Product.find({});

    if (!products) {
      // return []
      throw new Error("No products found");
    }

    return products;
  } catch (error) {
    console.log(error);
  }
}
