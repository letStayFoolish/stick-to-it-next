"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as productService from "@/lib/services/productService";
import * as shoppingListService from "@/lib/services/shoppingListService";

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

  const auth = await requireUser();

  if (!auth.authenticated) {
    return { success: false, message: "Not authenticated" };
  }

  await connectDB();

  const result = await productService.quickAddProduct(
    auth.userId,
    name,
    category,
  );

  if (!result.ok) {
    return { success: false, message: result.error };
  }

  await shoppingListService.addItem(auth.userId, result.productId);
  revalidatePath("/shopping-list");

  return { success: true };
}
