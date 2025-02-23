import type { ProductPlain } from "@/lib/types";
import React from "react";
import LikeButtonsSet from "@/components/Product/LikeButtonsSet";
import { verifySession } from "@/lib/dal";
import AddToCartSection from "@/components/Product/AddToCartSection";
import { fetchShoppingListItems as fetchShoppingListItemsAction } from "@/lib/actions/fetchShoppingListItems";
import ProductName from "@/components/Product/ProductName";

type Props = {
  product: ProductPlain;
};

const ProductItem: React.FC<Props> = async ({ product }) => {
  const session = await verifySession();

  const fetchedProducts = await fetchShoppingListItemsAction();

  // Find the product quantity in the fetched shopping list
  const quantity = fetchedProducts?.find(
    (p) => p?._id === product?._id,
  )?.quantity;

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center w-full">
        {session && <LikeButtonsSet product={product} />}
        <ProductName productName={product.product_name} />
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-4">
          {session && (
            <AddToCartSection product={product} quantityFromServer={quantity} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
