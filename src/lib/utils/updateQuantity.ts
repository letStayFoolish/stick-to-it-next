import { revalidatePath } from "next/cache";
import { getBaseURL } from "@/lib/actions";

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
 * @param productId
 * @param action
 */

export async function updateQuantity(
  productId: string,
  action: "increase" | "decrease",
) {
  try {
    const baseURL = await getBaseURL();

    const response = await fetch(
      `${baseURL}/api/user/shopping-list-${action === "increase" ? "increase" : "decrease"}-qty`,
      {
        method: "PATCH",
        body: JSON.stringify({
          productId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update quantity");
    }

    const data = await response.json();

    revalidatePath("/products/[slug]");
    revalidatePath("/shopping-list");
    return data.updatedList; // Return updated list if necessary
  } catch (error: any) {
    console.log(error);
  }
}
