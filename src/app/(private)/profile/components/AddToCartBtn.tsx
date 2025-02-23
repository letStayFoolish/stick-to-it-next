"use client";

import React, { Dispatch } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import type { ProductPlain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type Props = ButtonProps & {
  product: ProductPlain;
  handleIsAddedState: Dispatch<React.SetStateAction<number>>;
};

const AddToCartBtn: React.FC<Props> = ({
  product,
  handleIsAddedState,
  ...props
}) => {
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      handleIsAddedState((prevState) => prevState + 1);

      const response = await fetch(`/api/user/shopping-list-add-items`, {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add item to shopping list");
      }

      const data = await response.json();

      toast({
        title: "Shopping list updated!",
        description: `Added ${product.product_name} to shopping list.`,
        action: (
          <ToastAction altText="Go To Shopping List">
            <Link href={"/shopping-list"}>Go to shopping list</Link>
          </ToastAction>
        ),
      });

      return data;
    } catch (error: any) {
      console.error("Error adding item to shopping list:", error);

      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message || "An unknown error occurred",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleAddToCart}
      className="text-accent-foreground hover:opacity-80"
      {...props}
    >
      <ShoppingCart size={18} />
    </Button>
  );
};

export default AddToCartBtn;
