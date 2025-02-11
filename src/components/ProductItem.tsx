"use client";
import { Product as ProductType } from "@/lib/types";
import React from "react";
import { FaHeart, FaMinus, FaPlus } from "react-icons/fa6";
import { handleSpacesInProductName } from "@/lib/utils";
import {
  Button,
  Button as IncrementDecrementButton,
} from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";
import { Tooltip as ReactTooltip } from "react-tooltip";

type Props = {
  product: Omit<ProductType, "_id"> & { _id: string };
};

const ProductItem: React.FC<Props> = ({ product }) => {
  const toggleLike = () => {
    console.log("Like");
  };

  const handleAddItem = () => {};

  const isDetailedAddingModeVisible = false;
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center w-full">
        <FaHeart
          className="text-lg w-auto mr-1 cursor-pointer hover:opacity-80 hover:scale-125 transition"
          onClick={toggleLike}
        />
        <span
          data-tooltip-id="tooltip-allProducts"
          data-tooltip-content={handleSpacesInProductName(product.product_name)}
          className={`text-md lg:text-lg overflow-hidden overflow-ellipsis whitespace-nowrap inline-block ${
            isDetailedAddingModeVisible ? "w-[100px]" : "w-[200px]"
          } lg:w-full`}
        >
          {handleSpacesInProductName(product.product_name)}
          <ReactTooltip
            className="block sm:hidden"
            id="tooltip-allProducts"
            variant="dark"
            place="top-end"
            content={handleSpacesInProductName(product.product_name)}
          />
        </span>
      </div>
      <div className="flex gap-6">
        <Button onClick={handleAddItem} className="px-3 py-2">
          <ShoppingBasket width={20} height={20} />
        </Button>

        <section className="flex gap-4" id="add-box">
          <IncrementDecrementButton
            onClick={() => {}}
            disabled={false}
            className="flex justify-center items-center min-w-[30px] px-3 py-0.5 m-0 border-r border-border text-primary bg-secondary hover:bg-popover transition rounded-tl-md rounded-bl-md focus:outline-none focus:ring ring-ring active:bg-secondary cursor-pointer"
          >
            <FaMinus />
          </IncrementDecrementButton>

          <IncrementDecrementButton
            onClick={() => {}}
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
