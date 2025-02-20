import type { ProductPlain } from "@/lib/types";
import React from "react";
import { handleProductName } from "@/lib/utils";
import LikeButtonsSet from "@/components/Product/LikeButtonsSet";
import { verifySession } from "@/lib/dal";
import { fetchShoppingListItems } from "@/lib/actions";
import AddToCartSection from "@/components/Product/AddToCartSection";

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
          {session && (
            <AddToCartSection product={product} shouldDisplay={isAdded} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
