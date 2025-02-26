import { useState } from "react";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
import type { ProductPlain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useHandleLike(product: ProductPlain) {
  const { toast } = useToast();

  const [isLikedLocal, setIsLikedLocal] = useState(product.isLiked);
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    try {
      setIsPending(true);

      void toggleLikeAction(product._id);

      toast({
        title: "Favorite list updated!",
        description: `${isLikedLocal ? "Removed" : "Added"} ${product.product_name} ${isLikedLocal ? "from" : "to"} your favorites list.`,
      });

      setIsLikedLocal(!isLikedLocal);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: `Something went wrong while trying to ${product.isLiked ? "dislike" : "like"} ${product.product_name}`,
      });

      setIsLikedLocal(!isLikedLocal);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, isLikedLocal, handleLike };
}
