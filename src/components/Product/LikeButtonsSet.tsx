"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useToggleLike } from "@/hooks/useToggleLike";
import { ProductPlain } from "@/lib/types";

type Props = {
  product: ProductPlain;
};

const LikeButtonsSet: React.FC<Props> = ({ product }) => {
  const { isLiked, toggleLike } = useToggleLike(product);

  return (
    <>
      {isLiked ? (
        <Button
          variant="ghost"
          type="button"
          className="text-primary p-0 m-0 hover:bg-transparent"
          onClick={toggleLike}
        >
          <FaHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          type="button"
          className="text-primary p-0 m-0 hover:bg-transparent"
          onClick={toggleLike}
        >
          <FaRegHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
        </Button>
      )}
    </>
  );
};

export default LikeButtonsSet;
