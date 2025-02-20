"use client";

import React, { useState } from "react";
import AddToCartBtn from "@/app/(private)/profile/components/AddToCartBtn";
import type { ProductPlain } from "@/lib/types";

type Props = {
  product: ProductPlain;
  shouldDisplay: boolean | undefined;
};
const CellBtn: React.FC<Props> = ({ shouldDisplay, product }) => {
  const [isAdded, setIsAdded] = useState(shouldDisplay ?? false);

  return (
    <AddToCartBtn
      product={product}
      disabled={isAdded}
      handleIsAddedState={setIsAdded}
    />
  );
};

export default CellBtn;
