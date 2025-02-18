"use client";

import type { ProductPlain } from "@/lib/types";
import React, { useState } from "react";
import { FaHeart, FaMinus, FaPlus } from "react-icons/fa6";
import {
  Button,
  Button as IncrementDecrementButton,
} from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { handleProductName } from "@/lib/utils";
import { FaRegHeart } from "react-icons/fa";

type Props = {
  product: ProductPlain;
};

const ProductItem: React.FC<Props> = ({ product }) => {
  const [isLiked, setIsLiked] = useState<boolean>(product?.isLiked ?? false);

  const session = true; // Todo: somehow we have to read cookies on Client to check session

  const toggleLike = async () => {
    try {
      const response = await fetch(`/api/user/toggle-like`, {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to toggle like");

      const data = await response.json();
      if (data.success) {
        setIsLiked((prevState) => !prevState);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAddItem = () => {};

  const isDetailedAddingModeVisible = false;
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center w-full">
        {session ? (
          isLiked ? (
            <FaHeart
              className="text-lg w-auto mr-1 cursor-pointer hover:opacity-80 hover:scale-125 transition"
              onClick={toggleLike}
            />
          ) : (
            <FaRegHeart
              className="text-lg w-auto mr-1 cursor-pointer hover:opacity-80 hover:scale-125 transition"
              onClick={toggleLike}
            />
          )
        ) : null}
        <span
          data-tooltip-id="tooltip-allProducts"
          data-tooltip-content={handleProductName(product.product_name)}
          className={`text-md lg:text-lg overflow-hidden overflow-ellipsis whitespace-nowrap inline-block ${
            isDetailedAddingModeVisible ? "w-[100px]" : "w-[200px]"
          } lg:w-full`}
        >
          {handleProductName(product.product_name)}
          <ReactTooltip
            className="block sm:hidden"
            id="tooltip-allProducts"
            variant="dark"
            place="top-end"
            content={handleProductName(product.product_name)}
          />
        </span>
      </div>
      <div className="flex gap-6">
        <Button
          onClick={handleAddItem}
          className="px-3 py-2"
          disabled={!session}
        >
          <ShoppingBasket width={20} height={20} />
        </Button>

        <section className="flex gap-4" id="add-box">
          <IncrementDecrementButton
            onClick={() => {}}
            disabled={!session}
            className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-r border-border text-primary bg-secondary hover:bg-popover transition rounded-tl-md rounded-bl-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
          >
            <FaMinus />
          </IncrementDecrementButton>

          <IncrementDecrementButton
            onClick={() => {}}
            disabled={!session}
            className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-l border-border text-primary bg-secondary hover:bg-popover transition rounded-tr-md rounded-br-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
          >
            <FaPlus />
          </IncrementDecrementButton>
        </section>
      </div>
    </div>
  );
};

export default ProductItem;
