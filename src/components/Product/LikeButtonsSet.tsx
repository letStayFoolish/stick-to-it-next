"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { ProductPlain } from "@/lib/types";
import { useHandleLike } from "@/hooks/useHandleLike";

type Props = {
  product: ProductPlain;
};

const BURST_DOTS = [
  { dx: -18, dy: -14 },
  { dx: 18, dy: -14 },
  { dx: -22, dy: 4 },
  { dx: 22, dy: 4 },
  { dx: 0, dy: -22 },
  { dx: 0, dy: 20 },
];

const LikeButtonsSet: React.FC<Props> = ({ product }) => {
  const t = useTranslations("Favorites");
  const { isPending, isLikedLocal, handleLike } = useHandleLike(product);
  const [showBurst, setShowBurst] = useState(false);

  const onClick = () => {
    if (!isLikedLocal) {
      setShowBurst(true);
    }
    handleLike();
  };

  return (
    <Button
      variant="ghost"
      className="relative text-accent-ink p-0 m-0 hover:bg-transparent"
      disabled={isPending}
      onClick={onClick}
      aria-label={t(isLikedLocal ? "removeAriaLabel" : "addAriaLabel")}
    >
      {isLikedLocal ? (
        <FaHeart
          key="filled"
          className="like-icon-pop cursor-pointer hover:opacity-80 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]"
        />
      ) : (
        <FaRegHeart className="cursor-pointer hover:opacity-80 hover:scale-110 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
      )}
      {showBurst && (
        <span
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          onAnimationEnd={() => setShowBurst(false)}
        >
          {BURST_DOTS.map(({ dx, dy }, i) => (
            <span
              key={i}
              className="like-burst-dot"
              style={{ "--dx": `${dx}px`, "--dy": `${dy}px` } as React.CSSProperties}
            />
          ))}
        </span>
      )}
    </Button>
  );
};

export default LikeButtonsSet;
