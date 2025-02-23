import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import GoToPage from "@/components/GoToPage";

const EmptyShoppingList: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 px-3 py-4 text-center">
        <h2 className="font-extrabold text-start text-2xl md:text-3xl text-primary uppercase drop-shadow-md">
          Shopping List is Empty
        </h2>
      </div>
      <FaCartShopping className="text-primary text-6xl mb-12" />
      <GoToPage
        className="bg-secondary px-4 py-3 mb-6 md:mb-2 rounded-md hover:opacity-80 transition-opacity flex items-center w-fit"
        href={"/products"}
      >
        Browse Products
      </GoToPage>
    </div>
  );
};

export default EmptyShoppingList;
