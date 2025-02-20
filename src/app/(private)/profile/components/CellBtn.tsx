"use client";

import React, { useState } from "react";
import AddToCartBtn from "@/app/(private)/profile/components/AddToCartBtn";
import type { ProductPlain } from "@/lib/types";

type Props = {
  product: ProductPlain;
  quantity: number | undefined;
};
const CellBtn: React.FC<Props> = ({ quantity, product }) => {
  const [quantityLocalState, setQuantityLocalState] = useState<number>(
    quantity ?? 0,
  );
  return (
    <AddToCartBtn
      product={product}
      disabled={quantityLocalState !== 0}
      handleIsAddedState={setQuantityLocalState}
    />
  );
};

export default CellBtn;
