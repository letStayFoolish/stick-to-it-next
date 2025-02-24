"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/dal";

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
      // || typeof productId !== "string"
      throw new Error("Invalid form data");
    }

    const userData = await getUser();

    const itemIndex = userData?.listItems?.findIndex(
      (item: any) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      // Item exists in cart, update quantity
      userData.listItems[itemIndex].quantity =
        action === "increase"
          ? Math.min(100, userData.listItems[itemIndex].quantity + 1)
          : action === "remove-from-list"
            ? (userData.listItems[itemIndex].quantity = 0)
            : Math.max(0, userData.listItems[itemIndex].quantity - 1);

      if (userData.listItems[itemIndex].quantity === 0) {
        userData.listItems.splice(itemIndex, 1);
      }
    } else if (action === "add-to-list") {
      // Item does not exist, add it to the cart
      userData.listItems.push({ productId, quantity: 1 });
    } else {
      throw new Error("Cannot decrease quantity for an item not in the cart");
    }

    await userData.save();

    // Revalidate affected pages after changes
    revalidatePath("/shopping-list");
    revalidatePath("/products");

    return {
      message: `Quantity successfully ${action === "increase" ? "increased" : action === "add-to-list" ? "added to list" : "decreased"}`,
      success: true,
      updatedShoppingList: userData.cartItems, // Return if necessary for feedback
    };
  } catch (error: any) {
    console.log(error);

    return {
      message: "Failed to update quantity",
      success: prevState?.success || false, // Preserve UI state where possible
    };
  }
}
