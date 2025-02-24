"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/dal";

export async function toggleLike(
  prevState: { message: string; success: boolean | undefined },
  formData: FormData,
) {
  try {
    const productId = formData.get("product_id");

    if (!productId || typeof productId !== "string") {
      throw new Error("Invalid product ID");
    }

    const userData = await getUser();

    // Check if the Product is already liked
    const isLiked = userData.likedItems.includes(productId);

    if (isLiked) {
      userData.likedItems = (userData.likedItems as string[]).filter(
        (id) => id?.toString() !== productId,
      );
    } else {
      userData.likedItems.push(productId);
    }

    await userData.save();

    revalidatePath("/products");
    revalidatePath("/profile");

    return { message: "Like status updated", success: !isLiked };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Failed to update like status",
      success: prevState?.success || false,
    };
  }
}
