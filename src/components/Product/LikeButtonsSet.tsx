"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { ProductPlain } from "@/lib/types";
import { useHandleLike } from "@/hooks/useHandleLike";

type Props = {
  product: ProductPlain;
};

const LikeButtonsSet: React.FC<Props> = ({ product }) => {
  const { isPending, isLikedLocal, handleLike } = useHandleLike(product);
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
