"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as shoppingListService from "@/lib/services/shoppingListService";

export async function clearProducts(prevState: any, formData: FormData) {
  const t = await getTranslations("Errors");

  try {
    const isClearAllActive = formData.get("action");

    if (isClearAllActive !== "clear-all") {
      return {
        message: t("clearListInvalidAction"),
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
      message: t("clearListSuccess"),
      success: true,
    };
  } catch (error: any) {
    console.log(error);

    return {
      message: t("clearListFailed"),
      success: prevState?.success || false,
    };
  }
}
