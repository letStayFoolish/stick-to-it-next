import React from "react";
import { getTranslations } from "next-intl/server";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const LogoComponent: React.FC = async () => {
  const t = await getTranslations("Brand");

  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <ShoppingCart className="h-6 w-6" /> {t("name")}
      <span className="sr-only">{t("name")}</span>
    </Link>
  );
};

export default LogoComponent;
