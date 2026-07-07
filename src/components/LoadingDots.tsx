import React from "react";
import { getTranslations } from "next-intl/server";
import { FaCartShopping } from "react-icons/fa6";

const LoadingDots: React.FC = async () => {
  const t = await getTranslations("Brand");

  return (
    <div className="fixed inset-0 flex items-center justify-center flex-1 w-full space-x-2 bg-background">
      <span className="sr-only">{t("loading")}</span>
      <div className="flex items-center text-xl font-semibold md:text-base mr-12">
        <FaCartShopping className="h-8 w-auto" />
        <span className="hidden md:block lg:text-xl font-bold ml-2">
          {t("name")}
        </span>
        <span className="sr-only">{t("name")}</span>
      </div>
      <div className="h-8 w-8 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-8 w-8 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-8 w-8 bg-foreground rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingDots;
