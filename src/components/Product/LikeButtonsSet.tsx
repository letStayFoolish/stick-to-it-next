"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { ProductPlain } from "@/lib/types";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";

type Props = {
  product: ProductPlain;
};

const LikeButtonsSet: React.FC<Props> = ({ product }) => {
  const { toast } = useToast();
  const [isLikedLocal, setIsLikedLocal] = useState(product.isLiked);
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    try {
      setIsPending(true);

      await toggleLikeAction(product._id);

      toast({
        title: "Favorite list updated!",
        description: `${product.isLiked ? "removed" : "added"} ${product.product_name} ${product.isLiked ? "from" : "to"} your favorites list.`,
        action: (
          <ToastAction altText="Go To Profile Page">
            <Link href={"/profile"}>Go to profile page</Link>
          </ToastAction>
        ),
      });

      setIsLikedLocal(!isLikedLocal);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: `Something went wrong while trying to ${product.isLiked ? "dislike" : "like"} ${product.product_name}`,
        action: (
          <ToastAction altText="Go To Profile Page">
            <Link href={"/profile"}>Go to profile page</Link>
          </ToastAction>
        ),
      });

      setIsLikedLocal(!isLikedLocal);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="text-primary p-0 m-0 hover:bg-transparent"
      disabled={isPending}
      onClick={handleLike}
    >
      {isLikedLocal ? (
        <FaHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
      ) : (
        <FaRegHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
      )}
    </Button>
  );
};

export default LikeButtonsSet;
