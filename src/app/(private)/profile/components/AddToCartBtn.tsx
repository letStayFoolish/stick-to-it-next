"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type Props = {
  product: Product;
};

const AddToCartBtn: React.FC<Props> = ({ product }) => {
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`/api/user/shopping-list-add-items`, {
        method: "POST",
        body: JSON.stringify({
          productId: product._id.toString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response || !response.ok) {
        throw new Error("Failed to add item to shopping list");
      }

      toast({
        title: "Shopping list updated!",
        description: `Added ${product.product_name} to shopping list.`,
        action: (
          <ToastAction altText="Go To Shopping List">
            <Link href={"/shopping-list"}>Go to shopping list</Link>
          </ToastAction>
        ),
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleAddToCart}
      className="text-accent-foreground hover:opacity-80"
    >
      <ShoppingCart size={18} />
    </Button>
  );
};

export default AddToCartBtn;
