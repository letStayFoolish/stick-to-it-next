"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { ProductPlain } from "@/lib/types";
import { useDislike } from "@/hooks/useDislike";

type Props = {
  product: ProductPlain;
};

const RemoveFromFavoritesBtn: React.FC<Props> = ({ product }) => {
  const { isPending, handleLike } = useDislike(product);

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
