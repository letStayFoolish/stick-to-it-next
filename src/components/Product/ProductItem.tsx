import type { ProductPlain } from "@/lib/types";
import React from "react";
import { handleProductName } from "@/lib/utils";
import LikeButtonsSet from "@/components/Product/LikeButtonsSet";
import { verifySession } from "@/lib/dal";
import AddToCartBtn from "@/app/(private)/profile/components/AddToCartBtn";
import { Button as IncrementDecrementButton } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { fetchShoppingListItems } from "@/lib/actions";

type Props = {
  product: ProductPlain;
};

const ProductItem: React.FC<Props> = async ({ product }) => {
  const session = await verifySession();

  const shoppingListProducts = await fetchShoppingListItems();

  const isAdded = shoppingListProducts?.some(
    (addedItem) => addedItem._id === product._id,
  );

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center w-full">
        {session && <LikeButtonsSet product={product} />}
        <span
          data-tooltip-id="tooltip-allProducts"
          data-tooltip-content={handleProductName(product.product_name)}
          className={`text-md lg:text-lg overflow-hidden overflow-ellipsis whitespace-nowrap inline-block w-[200px] lg:w-full`}
        >
          {handleProductName(product.product_name)}
        </span>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-4">
          {!isAdded ? (
            <AddToCartBtn product={product} disabled={!session} />
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
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
