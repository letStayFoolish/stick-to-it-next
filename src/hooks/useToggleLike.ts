import { useState } from "react";
import type { ProductPlain } from "@/lib/types";

export function useToggleLike(product: ProductPlain) {
  const [isLiked, setIsLiked] = useState<boolean>(product?.isLiked ?? false);

  const productId = product._id;

  async function toggleLike() {
    try {
      const response = await fetch(`/api/user/toggle-like`, {
        method: "POST",
        body: JSON.stringify({
          productId: productId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to toggle like");

      const data = await response.json();
      if (data.success) {
        setIsLiked((prevState) => !prevState);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  return { isLiked, toggleLike };
}
