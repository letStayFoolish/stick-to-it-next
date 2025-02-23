"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toggleLike } from "@/lib/utils/toggleLike";

type Props = {
  productId: string;
};

const RemoveFromFavoritesBtn: React.FC<Props> = ({ productId }) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const onClick = async () => {
    try {
      setIsPending(true);

      await toggleLike(productId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="text-red-500 hover:text-red-700"
    >
      {isPending ? <LoadingSpinner /> : <Trash2 size={18} />}
    </Button>
  );
};

export default RemoveFromFavoritesBtn;
