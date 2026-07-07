import React from "react";
import { getTranslations } from "next-intl/server";

import { ShoppingCart } from "lucide-react";

const EmptyShoppingList: React.FC = async () => {
  const t = await getTranslations("ShoppingListPage");

  return (
    <div className="flex flex-col justify-center items-center p-4 h-full">
      <div className="flex justify-between gap-4 mb-4 px-3 py-4 text-center">
        <ShoppingCart className="text-accent-ink text-4xl" />

        <h2 className="font-medium text-start text-xl text-accent-ink uppercase drop-shadow-md">
          {t("empty")}
        </h2>
      </div>
    </div>
  );
};

export default EmptyShoppingList;
