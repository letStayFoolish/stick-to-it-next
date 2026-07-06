"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { getUser } from "@/lib/dal";
import connectDB from "@/lib/database";
import * as shoppingListService from "@/lib/services/shoppingListService";

/**
 * `revalidatePath` allows you to purge cached data on-demand for a specific path.
 *
 * Good to know:
 *
 * revalidatePath only invalidates the cache when the included path is next visited. This means calling revalidatePath with a dynamic route segment will not immediately trigger many revalidations at once. The invalidation only happens when the path is next visited.
 *
 * Currently, revalidatePath invalidates all the routes in the client-side Router Cache when used in a server action. This behavior is temporary and will be updated in the future to apply only to the specific path.
 * Using revalidatePath invalidates only the specific path in the server-side Route Cache.
 *
 */

export async function updateQuantity(prevState: any, formData: FormData) {
  try {
    const productId = formData.get("product_id") as string;
    const action = formData.get("action") as
      | "increase"
      | "decrease"
      | "add-to-list"
      | "remove-from-list";

    // Validate form data
    if (!productId || !action) {
      throw new Error("Invalid form data");
    }

    const auth = await requireUser();

    if (!auth.authenticated) {
      throw new Error("Not authenticated");
    }

    await connectDB();

    let updatedShoppingList;

    if (action === "add-to-list") {
      updatedShoppingList = await shoppingListService.addItem(
        auth.userId,
        productId,
      );
    } else if (action === "remove-from-list") {
      updatedShoppingList = await shoppingListService.setQuantity(
        auth.userId,
        productId,
        0,
      );
    } else {
      const userData = await getUser();
      const currentItem = userData?.listItems?.find(
        (item: any) => item.productId.toString() === productId,
      );

      if (!currentItem) {
        throw new Error("Cannot decrease quantity for an item not in the cart");
      }

      const nextQuantity =
        action === "increase"
          ? Math.min(100, currentItem.quantity + 1)
          : Math.max(0, currentItem.quantity - 1);

      updatedShoppingList = await shoppingListService.setQuantity(
        auth.userId,
        productId,
        nextQuantity,
      );
    }

    // Revalidate affected pages after changes
    revalidatePath("/shopping-list");

    return {
      message: `Quantity successfully ${action === "increase" ? "increased" : action === "add-to-list" ? "added to list" : "decreased"}`,
      success: true,
      updatedShoppingList,
    };
  } catch (error: any) {
    console.log(error);

    return {
      message: "Failed to update quantity",
      success: prevState?.success || false, // Preserve UI state where possible
    };
  }
}
