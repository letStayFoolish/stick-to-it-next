import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { handleProductName } from "@/lib/utils";
import RemoveFromFavoritesBtn from "@/app/(private)/profile/components/RemoveFromFavoritesBtn";
import { ProductPlain } from "@/lib/types";
import { fetchShoppingListItems } from "@/lib/actions";
import CellBtn from "@/app/(private)/profile/components/CellBtn";

type Props = {
  product: ProductPlain;
};

export const ShoppingListTableRow: React.FC<Props> = async ({ product }) => {
  const shoppingListProducts = await fetchShoppingListItems();

  const isAdded = shoppingListProducts?.some(
    (addedItem) => addedItem._id === product._id,
  );

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
          <CellBtn shouldDisplay={isAdded} product={product} />
        </div>
      </TableCell>
    </TableRow>
  );
};
