"use server";

import connectDB from "@/lib/database";
import { requireUser } from "@/lib/session";
import * as productService from "@/lib/services/productService";
import { cache } from "react";

export const fetchOwnedProducts = cache(async () => {
  await connectDB();

  const auth = await requireUser();

  if (!auth.authenticated) {
    return [];
  }

  return productService.getOwnedProducts(auth.userId);
});
