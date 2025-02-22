"use server";

import { revalidatePath } from "next/cache";

export async function toggleLikeAction(productId: string) {
  "use server";
  try {
    const response = await fetch(`/api/user/toggle-like`, {
      method: "POST",
      body: JSON.stringify({
        productId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to toggle like");

    const data = await response.json();

    if (!data.success) {
      throw new Error("Server failed to update like status");
    }

    revalidatePath("/shopping-list");
    revalidatePath("/products/[slug]");
  } catch (error: any) {
    console.log(error);
  }
}
