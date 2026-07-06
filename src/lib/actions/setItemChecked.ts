"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as shoppingListService from "@/lib/services/shoppingListService";

export async function setItemChecked(productId: string, checked: boolean) {
  try {
    if (!productId) {
      throw new Error("Invalid product ID");
    }

    const auth = await requireUser();

    if (!auth.authenticated) {
      return;
    }

    await connectDB();

    await shoppingListService.setChecked(auth.userId, productId, checked);

    revalidatePath("/shopping-list");
  } catch (error: any) {
    console.log(error);
  }
}
