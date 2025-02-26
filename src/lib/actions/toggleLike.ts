"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/dal";

export async function toggleLike(productId: string) {
  try {
    if (!productId) {
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

    revalidatePath("/profile");
  } catch (error: any) {
    console.log(error);
  }
}
