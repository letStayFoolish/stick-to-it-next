import { useState } from "react";
import { useTranslations } from "next-intl";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
import type { ProductPlain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useHandleLike(product: ProductPlain) {
  const { toast } = useToast();
  const t = useTranslations("Favorites");

  const [isLikedLocal, setIsLikedLocal] = useState(product.isLiked);
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    try {
      setIsPending(true);

      void toggleLikeAction(product._id);

      toast({
        title: t("updatedTitle"),
        description: t(isLikedLocal ? "removed" : "added", {
          name: product.product_name,
        }),
      });

      setIsLikedLocal(!isLikedLocal);
    } catch (error: any) {
      console.log(error);
      toast({
        title: t("errorTitle"),
        description: t(product.isLiked ? "errorDislike" : "errorLike", {
          name: product.product_name,
        }),
      });

      setIsLikedLocal(!isLikedLocal);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, isLikedLocal, handleLike };
}
