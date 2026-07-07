"use server";

import connectDB from "@/lib/database";
import { requireUser } from "@/lib/session";
import * as productService from "@/lib/services/productService";
import { cache } from "react";

export const fetchProducts = cache(async () => {
  try {
    await connectDB();

    const auth = await requireUser();
    const userId = auth.authenticated ? auth.userId : null;

    const products = await productService.getVisibleProducts(userId);

    if (!products || products.length === 0) {
      return [];
    }

    return products;
  } catch (error) {
    console.log(error);
  }
});
