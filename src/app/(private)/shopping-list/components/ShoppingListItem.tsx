"use client";

import React from "react";
import type { Product as ProductType } from "@/lib/types";

type Props = {
  product: ProductType;
};

const ShoppingListItem: React.FC<Props> = ({ product }) => {
  // return <div>{Product?.product_name}</div>;
  console.log({ product });
  return <h3>Shopping List</h3>;
};

export default ShoppingListItem;
