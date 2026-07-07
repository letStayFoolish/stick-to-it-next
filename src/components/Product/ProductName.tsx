"use client";

import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { cn } from "@/lib/utils";

type Props = {
  productName: string;
  checked?: boolean;
};

const ProductName: React.FC<Props> = ({ productName, checked = false }) => {
  return (
    <>
      <span
        className={cn(
          "truncate lg:text-lg w-[200px] lg:w-full min-w-0 line-through decoration-2 transition-colors duration-300",
          checked
            ? "text-muted-foreground decoration-muted-foreground"
            : "text-foreground decoration-transparent",
        )}
        data-tooltip-id="tooltip-productName"
        data-tooltip-content={productName}
      >
        {productName}
      </span>
      <ReactTooltip
        id="tooltip-productName"
        className="block sm:hidden"
        variant="dark"
        content={productName}
        openOnClick
      />
    </>
  );
};

export default ProductName;
