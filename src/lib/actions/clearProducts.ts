"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as shoppingListService from "@/lib/services/shoppingListService";

export async function clearProducts(prevState: any, formData: FormData) {
  try {
    const isClearAllActive = formData.get("action");

    if (isClearAllActive !== "clear-all") {
      return {
        message: "Invalid action",
        success: false,
      };
    }

    const auth = await requireUser();

    if (!auth.authenticated) {
      throw new Error("Not authenticated");
    }

    await connectDB();

    await shoppingListService.clearList(auth.userId);

    revalidatePath("/shopping-list");

    return {
      message: "Products cleared",
      success: true,
    };
  } catch (error: any) {
    console.log(error);

    return {
      message: "Failed to clear products",
      success: prevState?.success || false,
    };
  }
}
