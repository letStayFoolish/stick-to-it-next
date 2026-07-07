"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as productService from "@/lib/services/productService";
import * as shoppingListService from "@/lib/services/shoppingListService";
import { PRODUCT_ERROR_MESSAGE_KEYS } from "@/lib/services/productService";

export type QuickAddState = {
  success: boolean;
  message?: string;
};

export async function quickAddItem(
  prevState: QuickAddState | undefined,
  formData: FormData,
): Promise<QuickAddState> {
  const name = (formData.get("name") as string) ?? "";
  const category = (formData.get("category") as string) ?? "";

  const tErrors = await getTranslations("Errors");

  const auth = await requireUser();

  if (!auth.authenticated) {
    return { success: false, message: tErrors("notAuthenticated") };
  }

  await connectDB();

  const result = await productService.quickAddProduct(
    auth.userId,
    name,
    category,
  );

  if (!result.ok) {
    return {
      success: false,
      message: tErrors(PRODUCT_ERROR_MESSAGE_KEYS[result.error]),
    };
  }

  await shoppingListService.addItem(auth.userId, result.productId);
  revalidatePath("/shopping-list");

  return { success: true };
}
