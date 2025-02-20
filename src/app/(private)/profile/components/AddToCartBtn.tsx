"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import type { ProductPlain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type Props = ButtonProps & {
  product: ProductPlain;
  handleIsAddedState: Dispatch<SetStateAction<boolean>>;
};

const AddToCartBtn: React.FC<Props> = ({
  product,
  handleIsAddedState,
  ...props
}) => {
  const { toast } = useToast();

  const handleAddToCart = async () => {
    handleIsAddedState((prevState) => !prevState);

    try {
      const response = await fetch(`/api/user/shopping-list-add-items`, {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
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

      return;
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something vent wrong!",
        description: error,
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
