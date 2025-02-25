import React from "react";

import { ShoppingCart } from "lucide-react";

const EmptyShoppingList: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center p-4 h-full">
      <div className="flex justify-between gap-4 mb-4 px-3 py-4 text-center">
        <ShoppingCart className="text-primary text-4xl" />

        <h2 className="font-medium text-start text-xl text-primary uppercase drop-shadow-md">
          Shopping List is Empty
        </h2>
      </div>
    </div>
  );
};

export default EmptyShoppingList;
