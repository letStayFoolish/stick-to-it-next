import { useState } from "react";
import { useTranslations } from "next-intl";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
import type { ProductPlain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useDislike(product: ProductPlain) {
  const { toast } = useToast();
  const t = useTranslations("Favorites");

  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    try {
      setIsPending(true);

      void toggleLikeAction(product._id);

      toast({
        title: t("updatedTitle"),
        description: t("removed", { name: product.product_name }),
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: t("errorTitle"),
        description: t("errorDislike", { name: product.product_name }),
      });
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, handleLike };
}
