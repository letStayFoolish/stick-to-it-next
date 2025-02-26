"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
import type { ProductPlain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";

type Props = {
  product: ProductPlain;
};

const RemoveFromFavoritesBtn: React.FC<Props> = ({ product }) => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    try {
      setIsPending(true);

      await toggleLikeAction(product._id);

      toast({
        title: "Product disliked!",
        description: `Removed ${product.product_name} from your favorites list.`,
        action: (
          <ToastAction altText="Browse all products">
            <Link href={"/products"}>Browse all products</Link>
          </ToastAction>
        ),
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: `Something went wrong while trying to ${product.isLiked ? "dislike" : "like"} ${product.product_name}`,
        action: (
          <ToastAction altText="Browse all products">
            <Link href={"/products"}>Browse all products</Link>
          </ToastAction>
        ),
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="text-red-500 hover:text-red-700"
      disabled={isPending}
      onClick={handleLike}
    >
      {isPending ? <LoadingSpinner /> : <Trash2 size={18} />}
    </Button>
  );
};

export default RemoveFromFavoritesBtn;
