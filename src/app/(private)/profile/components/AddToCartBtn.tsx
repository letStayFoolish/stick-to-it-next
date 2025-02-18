"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

type Props = {
  productId: string;
};

const AddToCartBtn: React.FC<Props> = ({ productId }) => {
  const handleAddToCart = (productId: string) => {
    console.log(`Add product with ID: ${productId} to cart`);
    // Add the logic for adding the product to the cart here
  };

  return (
    <Button
      variant="outline"
      onClick={() => handleAddToCart(productId)}
      className="text-accent-foreground hover:opacity-80"
    >
      <ShoppingCart size={18} />
    </Button>
  );
};

export default AddToCartBtn;
