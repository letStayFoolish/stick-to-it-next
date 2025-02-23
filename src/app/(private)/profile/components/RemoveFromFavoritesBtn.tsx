"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
import type { ProductPlain } from "@/lib/types";

type Props = {
  product: ProductPlain;
};

const RemoveFromFavoritesBtn: React.FC<Props> = ({ product }) => {
  const [state, formAction, isPending] = useActionState(toggleLikeAction, {
    message: "",
    success: product.isLiked,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="product_id" value={product._id} />

      <Button
        variant="ghost"
        className="text-red-500 hover:text-red-700"
        disabled={isPending}
      >
        {isPending ? <LoadingSpinner /> : <Trash2 size={18} />}
      </Button>
      <p className="sr-only" aria-live="polite" role="status">
        {state?.message}
      </p>
    </form>
  );
};

export default RemoveFromFavoritesBtn;
