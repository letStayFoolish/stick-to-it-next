"use client";

import React, { useState } from "react";
import AddToCartBtn from "@/app/(private)/profile/components/AddToCartBtn";
import { Button as IncrementDecrementButton } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { ProductPlain } from "@/lib/types";

type Props = {
  product: ProductPlain;
  shouldDisplay: boolean | undefined;
};
const AddToCartSection: React.FC<Props> = ({ product, shouldDisplay }) => {
  const [isAdded, setIsAdded] = useState(shouldDisplay ?? false);

  return (
    <>
      {!isAdded ? (
        <AddToCartBtn product={product} handleIsAddedState={setIsAdded} />
      ) : (
        <section className="flex items-center gap-4" id="add-box">
          <IncrementDecrementButton className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-r border-border text-primary bg-secondary hover:bg-popover transition rounded-tl-md rounded-bl-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer">
            <FaMinus />
          </IncrementDecrementButton>
          <span className="text-lg">1</span>
          <span className="text-lg hidden md:block">qty.</span>
          <IncrementDecrementButton
            // onClick={() => {}}
            className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-l border-border text-primary bg-secondary hover:bg-popover transition rounded-tr-md rounded-br-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
          >
            <FaPlus />
          </IncrementDecrementButton>
        </section>
      )}
    </>
  );
};

export default AddToCartSection;
