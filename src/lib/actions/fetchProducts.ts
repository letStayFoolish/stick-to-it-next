"use server";

import connectDB from "@/lib/database";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/lib/locale";
import { requireUser } from "@/lib/session";
import * as productService from "@/lib/services/productService";
import { cache } from "react";

export const fetchProducts = cache(async () => {
  try {
    await connectDB();

    const auth = await requireUser();
    const userId = auth.authenticated ? auth.userId : null;
    const locale = (await getLocale()) as Locale;

    const products = await productService.getVisibleProducts(userId, locale);

    if (!products || products.length === 0) {
      return [];
    }

    return products;
  } catch (error) {
    console.log(error);
  }
});
