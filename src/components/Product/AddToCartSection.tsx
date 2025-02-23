"use client";

import React, { useState } from "react";
import AddToCartBtn from "@/app/(private)/profile/components/AddToCartBtn";
import { Button as IncrementDecrementButton } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { ProductPlain } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { updateQuantity as updateQuantityAction } from "@/lib/utils/updateQuantity";

type Props = {
  product: ProductPlain;
  quantityFromServer: number | undefined;
};

const AddToCartSection: React.FC<Props> = ({ product, quantityFromServer }) => {
  const [quantityLocalState, setQuantityLocalState] = useState<number>(
    quantityFromServer || 0,
  );
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleQuantityUpdate(
    productId: string,
    action: "increase" | "decrease",
  ) {
    try {
      setIsPending(true);

      // Optimistic UI update
      setQuantityLocalState(
        (prevState) =>
          action === "increase" ? prevState + 1 : Math.max(prevState - 1, 0), // Prevent negative state
      );

      await updateQuantityAction(productId, action);
    } catch (error: any) {
      console.error("Error updating quantity:", error);

      // Rollback optimistic UI state in case of error
      setQuantityLocalState((prevState) =>
        action === "increase" ? Math.max(prevState - 1, 0) : prevState + 1,
      );

      throw error;
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {!quantityLocalState || quantityLocalState === 0 ? (
        <AddToCartBtn
          product={product}
          handleIsAddedState={setQuantityLocalState}
        />
      ) : (
        <section className="flex items-center gap-4" id="add-box">
          <IncrementDecrementButton
            className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-r border-border text-primary bg-secondary hover:bg-popover transition rounded-tl-md rounded-bl-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
            onClick={async () => {
              await handleQuantityUpdate(product._id, "decrease");
            }}
            disabled={quantityLocalState === 0 || isPending}
          >
            {isPending ? <LoadingSpinner /> : <FaMinus />}
          </IncrementDecrementButton>

          <span className="text-lg">{quantityLocalState}</span>
          <span className="text-lg hidden md:block">qty.</span>

          <IncrementDecrementButton
            onClick={async () => {
              await handleQuantityUpdate(product._id, "increase");
            }}
            className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-l border-border text-primary bg-secondary hover:bg-popover transition rounded-tr-md rounded-br-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner /> : <FaPlus />}
          </IncrementDecrementButton>
        </section>
      )}
    </>
  );
};

export default AddToCartSection;
