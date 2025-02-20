"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useToggleLike } from "@/hooks/useToggleLike";
import { ProductPlain } from "@/lib/types";

type Props = {
  product: ProductPlain;
};

const LikeButtonsSet: React.FC<Props> = ({ product }) => {
  const [isLikedState, setIsLikedState] = useState<boolean>(
    product?.isLiked ?? false,
  );
  const [isPending, setIsPending] = useState<boolean>(false);

  const { toggleLike } = useToggleLike(product);

  const handleLike = async () => {
    try {
      setIsPending(true);
      setIsLikedState((prevState) => !prevState);

      await toggleLike();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      type="button"
      className="text-primary p-0 m-0 hover:bg-transparent"
      onClick={handleLike}
      disabled={isPending}
    >
      {isLikedState ? (
        <FaHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
      ) : (
        <FaRegHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
      )}
    </Button>
  );
};

export default LikeButtonsSet;
