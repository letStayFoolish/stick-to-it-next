import React from "react";
import { FaCartShopping } from "react-icons/fa6";

const ShoppingListLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-1 w-full h-full space-x-2 bg-background">
      <span className="sr-only">Loading...</span>
      <div className="flex items-center text-xl font-semibold md:text-base mr-12">
        <FaCartShopping className="h-8 w-auto" />
        <span className="hidden md:block lg:text-xl font-bold ml-2">
          Stick To It
        </span>
        <span className="sr-only">Stick To It</span>
      </div>
      <div className="h-8 w-8 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-8 w-8 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-8 w-8 bg-foreground rounded-full animate-bounce"></div>
    </div>
  );
};

export default ShoppingListLoading;
