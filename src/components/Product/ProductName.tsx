"use client";

import React from "react";
import { handleProductName } from "@/lib/utils";
import { Tooltip as ReactTooltip } from "react-tooltip";

type Props = {
  productName: string;
};

const ProductName: React.FC<Props> = ({ productName }) => {
  return (
    <>
      <span
        className={`truncate lg:text-lg w-[200px] lg:w-full`}
        data-tooltip-id="tooltip-productName"
        data-tooltip-content={handleProductName(productName)}
      >
        {handleProductName(productName)}
      </span>
      <ReactTooltip
        id="tooltip-productName"
        className="block sm:hidden"
        variant="dark"
        content={handleProductName(productName)}
      />
    </>
  );
};

export default ProductName;
