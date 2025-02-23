"use client";

import React, { useActionState } from "react";
import {
  Button,
  Button as IncrementDecrementButton,
} from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { ProductPlain } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { updateQuantity as updateQuantityAction } from "@/lib/actions/updateQuantity";
import { ShoppingCart } from "lucide-react";

type Props = {
  product: ProductPlain;
  quantityFromServer: number | undefined;
};

const AddToCartSection: React.FC<Props> = ({
  product,
  quantityFromServer = 0,
}) => {
  const [state, formAction, isPending] = useActionState(updateQuantityAction, {
    message: "",
    success: quantityFromServer > 0,
  });

  return (
    <div className="flex items-center gap-4">
      {quantityFromServer === 0 ? (
        <form action={formAction}>
          <input type="hidden" name="product_id" value={product._id} />
          <input type="hidden" name="action" value="add-to-list" />

          <Button
            variant="outline"
            className="text-accent-foreground hover:opacity-80"
            type="submit"
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner /> : <ShoppingCart />}
          </Button>
        </form>
      ) : (
        <section className="flex items-center gap-4" id="add-box">
          {/* Decrement Button */}

          <form action={formAction}>
            <input type="hidden" name="product_id" value={product._id} />
            <input type="hidden" name="action" value="decrease" />

            <IncrementDecrementButton
              className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-r border-border text-primary bg-secondary hover:bg-popover transition rounded-tl-md rounded-bl-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
              disabled={isPending}
              type="submit"
            >
              {isPending ? <LoadingSpinner /> : <FaMinus />}
            </IncrementDecrementButton>
          </form>

          <span className="text-lg">{quantityFromServer}</span>
          <span className="text-lg hidden md:block">qty.</span>

          {/* Increment Button */}
          <form action={formAction}>
            <input type="hidden" name="product_id" value={product._id} />
            <input type="hidden" name="action" value="increase" />

            <IncrementDecrementButton
              className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-l border-border text-primary bg-secondary hover:bg-popover transition rounded-tr-md rounded-br-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
              disabled={isPending}
              type="submit"
            >
              {isPending ? <LoadingSpinner /> : <FaPlus />}
            </IncrementDecrementButton>
          </form>

          <p className="sr-only" aria-live="polite" role="status">
            {state?.message}
          </p>
        </section>
      )}
    </div>
  );
};

export default AddToCartSection;
