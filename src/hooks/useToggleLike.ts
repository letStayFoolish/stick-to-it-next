import type { ProductPlain } from "@/lib/types";

export function useToggleLike(product: ProductPlain) {
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

      if (!data.success) {
        throw new Error("Server failed to update like status");
      }

      console.log("Like toggled successfully:", data);
    } catch (error: any) {
      console.log(error);
    }
  }

  return { toggleLike };
}
