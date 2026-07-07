import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { fetchOwnedProducts as fetchOwnedProductsAction } from "@/lib/actions/fetchOwnedProducts";
import NoData from "@/components/ui/NoData";
import MyItemRow from "@/app/(private)/profile/components/MyItemRow";

export const MyItemsList: React.FC = async () => {
  const ownedProducts = await fetchOwnedProductsAction();

  if (!ownedProducts || ownedProducts.length === 0) {
    return (
      <TableRow>
        <TableCell>
          <NoData text={`You haven't added any\n items of your own yet.`} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {ownedProducts.map((product) => (
        <MyItemRow key={product._id.toString()} product={product} />
      ))}
    </>
  );
};
