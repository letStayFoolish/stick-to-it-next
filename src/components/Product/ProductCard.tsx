import React from "react";
import { getTranslations } from "next-intl/server";
import { ProductPlain } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CategoryIcon from "@/components/CategoryIcon";

type Props = {
  product: ProductPlain;
};

const ProductCard: React.FC<Props> = async ({ product }) => {
  const t = await getTranslations("Categories");

  return (
    <Link href={`/products/${product?.category}`}>
      <Card className="bg-muted flex flex-col items-center max-w-[210px] max-h-[190px] lg:max-w-[280px] lg:max-h-[280px] px-3 py-4 transform transition-all duration-300 drop-shadow-md hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
        <CardHeader
          className="text-accent-ink text-lg text-center font-medium min-h-[60px] p-1 transition-all duration-300"
          style={{
            width: "100%",
          }}
        >
          {t(product.category)}
        </CardHeader>
        <CardContent className="p-2 transition-transform duration-500">
          <CategoryIcon
            category={product?.category}
            size="lg"
            className="transition-transform duration-500 hover:scale-110 hover:rotate-3"
          />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
