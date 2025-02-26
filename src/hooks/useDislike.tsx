import { useState } from "react";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
import type { ProductPlain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useDislike(product: ProductPlain) {
  const { toast } = useToast();

  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    try {
      setIsPending(true);

      await toggleLikeAction(product._id);

      toast({
        title: "Favorite list updated!",
        description: `Removed ${product.product_name} from your favorites list.`,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: `Something went wrong while trying to dislike ${product.product_name}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, handleLike };
}
