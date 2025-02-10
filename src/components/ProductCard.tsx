import React from "react";
import { Product } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <Link href={`/products/${product?.category}`}>
      <Card className="bg-muted flex flex-col items-center max-w-[210px] max-h-[190px] lg:max-w-[280px] lg:max-h-[280px] px-3 py-4 transform transition-all duration-300 drop-shadow-md hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
        <CardHeader className="text-primary text-lg text-center font-medium min-h-[60px] p-1 transition-all duration-300 hover:tracking-widest">
          {product.category}
        </CardHeader>
        <CardContent className="p-2 transition-transform duration-500">
          <Image
            src={`/images/categories/${product?.category}.png`}
            alt={product?.category}
            height={160}
            width={160}
            className="object-center object-cover max-h-[80px] max-w-[80px] lg:max-h-[160px] lg:max-w-[160px] transition-transform duration-500 hover:scale-110 hover:rotate-3"
            priority
          />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
