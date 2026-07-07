"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as productService from "@/lib/services/productService";

export type MyItemActionState = {
  success: boolean;
  message?: string;
};

export async function updateOwnedItem(
  prevState: MyItemActionState | undefined,
  formData: FormData,
): Promise<MyItemActionState> {
  const productId = (formData.get("product_id") as string) ?? "";
  const name = formData.get("name") as string | null;
  const category = formData.get("category") as string | null;

  const auth = await requireUser();

  if (!auth.authenticated) {
    return { success: false, message: "Not authenticated" };
  }

  await connectDB();

  const result = await productService.updateOwnedProduct(
    auth.userId,
    productId,
    { name: name ?? undefined, category: category ?? undefined },
  );

  if (!result.ok) {
    return { success: false, message: result.error };
  }

  revalidatePath("/profile");
  revalidatePath("/shopping-list");

  return { success: true };
}

export async function deleteOwnedItem(
  prevState: MyItemActionState | undefined,
  formData: FormData,
): Promise<MyItemActionState> {
  const productId = (formData.get("product_id") as string) ?? "";

  const auth = await requireUser();

  if (!auth.authenticated) {
    return { success: false, message: "Not authenticated" };
  }

  await connectDB();

  const result = await productService.deleteOwnedProduct(
    auth.userId,
    productId,
  );

  if (!result.ok) {
    return { success: false, message: result.error };
  }

  revalidatePath("/profile");
  revalidatePath("/shopping-list");

  return { success: true };
}
