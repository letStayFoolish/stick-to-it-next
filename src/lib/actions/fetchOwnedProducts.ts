"use server";

import connectDB from "@/lib/database";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/lib/locale";
import { requireUser } from "@/lib/session";
import * as productService from "@/lib/services/productService";
import { cache } from "react";

export const fetchOwnedProducts = cache(async () => {
  await connectDB();

  const auth = await requireUser();

  if (!auth.authenticated) {
    return [];
  }

  const locale = (await getLocale()) as Locale;

  return productService.getOwnedProducts(auth.userId, locale);
});
