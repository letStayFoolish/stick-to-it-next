import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { handleProductName } from "@/lib/utils";
import CellBtn from "@/app/(private)/profile/components/CellBtn";
import { fetchShoppingListItems as fetchShoppingListItemsAction } from "@/lib/actions/fetchShoppingListItems";
import RemoveFromFavoritesBtn from "@/app/(private)/profile/components/RemoveFromFavoritesBtn";
import { fetchFavoritesProducts as fetchFavoritesAction } from "@/lib/actions/fetchFavoritesProducts";
import NoData from "@/components/ui/NoData";

export const FavoritesList: React.FC = async () => {
  const shoppingListProducts = await fetchShoppingListItemsAction();
  const likedProducts = await fetchFavoritesAction();

  if (!likedProducts) {
    return (
      <TableRow>
        <TableCell>
          <NoData text={`Add some products to your\n favorites.`} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {likedProducts?.map((product) => {
        // Find the product quantity in the fetched shopping list
        const quantity = shoppingListProducts?.find(
          (p) => p._id === product._id,
        )?.quantity;

        return (
          <TableRow key={product._id}>
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
                <RemoveFromFavoritesBtn product={product} />
                <CellBtn quantityFromServer={quantity} product={product} />
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};
