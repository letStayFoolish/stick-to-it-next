"use client";

import React, { useState } from "react";
import type { ProductPlain } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import RemoveFromListBtn from "@/app/(private)/shopping-list/components/RemoveFromListBtn";
import ProductName from "@/components/Product/ProductName";
import { setItemChecked as setItemCheckedAction } from "@/lib/actions/setItemChecked";
import { handleProductName, cn } from "@/lib/utils";

type Props = {
  product: ProductPlain;
};

const ShoppingListItem: React.FC<Props> = ({ product }) => {
  const [isChecked, setIsChecked] = useState(product.checked ?? false);

  const handleCheckedChange = () => {
    const nextChecked = !isChecked;
    setIsChecked(nextChecked);
    void setItemCheckedAction(product._id, nextChecked);
  };

  const productDisplayName = handleProductName(product.product_name);

  return (
    <div
      role="checkbox"
      aria-checked={isChecked}
      aria-label={`Mark ${productDisplayName} as ${isChecked ? "not picked up" : "picked up"}`}
      tabIndex={0}
      onClick={handleCheckedChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCheckedChange();
        }
      }}
      className={cn(
        "flex items-center gap-2 rounded-2xl px-2 py-2 cursor-pointer transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        isChecked && "bg-accent/30",
      )}
    >
      <div className="flex items-center me-2">
        <Checkbox checked={isChecked} tabIndex={-1} aria-hidden="true" />
      </div>
      <div className="flex w-full justify-between items-center py-2">
        <div className="flex justify-between mr-2 w-full min-w-0">
          <ProductName productName={product.product_name} checked={isChecked} />
          <span
            className={cn(
              "transition-colors duration-300",
              isChecked ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {product.quantity}
          </span>
        </div>
      </div>
      <div
        className="py-2 sm:px-6 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <RemoveFromListBtn product={product} />
      </div>
    </div>
  );
};

export default ShoppingListItem;
