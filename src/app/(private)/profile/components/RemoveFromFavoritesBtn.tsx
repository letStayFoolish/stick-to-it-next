"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { handleDislike } from "@/lib/actions";

type Props = {
  productId: string;
};

const RemoveFromFavoritesBtn: React.FC<Props> = ({ productId }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => handleDislike(productId)}
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 size={18} />
    </Button>
  );
};

export default RemoveFromFavoritesBtn;
