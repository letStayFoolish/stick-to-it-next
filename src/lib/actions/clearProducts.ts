"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/dal";

export async function clearProducts(prevState: any, formData: FormData) {
  try {
    const isClearAllActive = formData.get("action");

    if (isClearAllActive !== "clear-all") {
      return {
        message: "Invalid action",
        success: false,
      };
    }

    const userData = await getUser();

    if (!userData.listItems)
      return {
        message: "No products to clear",
        success: false,
      };

    userData.listItems = [];
    userData.notes = "";

    userData.save();

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
