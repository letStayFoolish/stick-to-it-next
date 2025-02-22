import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { handleProductName } from "@/lib/utils";
import RemoveFromFavoritesBtn from "@/app/(private)/profile/components/RemoveFromFavoritesBtn";
import { ProductPlain } from "@/lib/types";
import CellBtn from "@/app/(private)/profile/components/CellBtn";
import { fetchShoppingListItems as fetchShoppingListItemsAction } from "@/lib/actions/fetchShoppingListItems";

type Props = {
  product: ProductPlain;
};

export const ShoppingListTableRow: React.FC<Props> = async ({ product }) => {
  const shoppingListProducts = await fetchShoppingListItemsAction();

  // Find the product quantity in the fetched shopping list
  const quantity = shoppingListProducts?.find(
    (p) => p._id === product._id,
  )?.quantity;

  return (
    <TableRow>
      <TableCell className="hidden md:block">{product._id}</TableCell>
      <TableCell>{product.product_name}</TableCell>
      <TableCell>
        <Link
          href={`/products/${product.category}`}
          className="text-accent-foreground font-bold hover:underline"
        >
          {handleProductName(product.category)}
        </Link>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-4 justify-end">
          <RemoveFromFavoritesBtn productId={product._id} />
          <CellBtn quantity={quantity} product={product} />
        </div>
      </TableCell>
    </TableRow>
  );
};
