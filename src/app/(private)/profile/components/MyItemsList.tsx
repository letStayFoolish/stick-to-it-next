import React from "react";
import { getTranslations } from "next-intl/server";
import { TableCell, TableRow } from "@/components/ui/table";
import { fetchOwnedProducts as fetchOwnedProductsAction } from "@/lib/actions/fetchOwnedProducts";
import NoData from "@/components/ui/NoData";
import MyItemRow from "@/app/(private)/profile/components/MyItemRow";

export const MyItemsList: React.FC = async () => {
  const ownedProducts = await fetchOwnedProductsAction();

  if (!ownedProducts || ownedProducts.length === 0) {
    const t = await getTranslations("Profile");
    return (
      <TableRow>
        <TableCell>
          <NoData text={t("myItemsEmpty")} />
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
