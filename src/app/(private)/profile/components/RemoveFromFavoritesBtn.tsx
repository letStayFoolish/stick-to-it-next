"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  productId: string;
};

const RemoveFromFavoritesBtn: React.FC<Props> = ({ productId }) => {
  const handleRemoveProduct = (productId: string) => {
    console.log(`Remove product with ID: ${productId}`);
    // Add the logic for removing the product from the user's favorites here
  };

  return (
    <Button
      variant="ghost"
      onClick={() => handleRemoveProduct(productId)}
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 size={18} />
    </Button>
  );
};

export default RemoveFromFavoritesBtn;
