"use client";

import React, { useState } from "react";
import type { ProductPlain } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import RemoveFromListBtn from "@/app/(private)/shopping-list/components/RemoveFromListBtn";
import { handleProductName } from "@/lib/utils";
import { Tooltip as ReactTooltip } from "react-tooltip";

type Props = {
  product: ProductPlain;
};

const ShoppingListItem: React.FC<Props> = ({ product }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex items-center me-2">
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => setIsChecked(!isChecked)}
            id={`row-${product._id}`}
            className="peer"
            aria-labelledby={`row-${product._id}`}
            aria-describedby={`row-${product._id}`}
            aria-checked={isChecked}
          />
        </div>
        <div className="flex w-full justify-between items-center py-2">
          <div
            className={`${
              isChecked ? "text-gray-400 line-through" : "text-foreground"
            } flex justify-between mr-2 w-full`}
          >
            <span
              className={`truncate lg:text-lg w-[200px] lg:w-full`}
              data-tooltip-id="tooltip-productName"
              data-tooltip-content={handleProductName(product.product_name)}
            >
              {handleProductName(product.product_name as string)}
              <ReactTooltip
                id="tooltip-productName"
                className="block sm:hidden"
                variant="dark"
                content={handleProductName(product.product_name)}
              />
            </span>
            <span>{product.quantity}</span>
          </div>
        </div>
        <div className="py-2 sm:px-6 text-right">
          <RemoveFromListBtn productId={product._id} />
        </div>
      </div>
    </>
  );
};

export default ShoppingListItem;
