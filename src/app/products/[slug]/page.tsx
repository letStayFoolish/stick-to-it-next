import React from "react";
import type { CategoriesType } from "@/lib/types";
import Image from "next/image";
import { fetchProductsFromCategory } from "@/lib/actions";
import GoToPage from "@/components/GoToPage";
import NoData from "@/components/ui/NoData";
import ProductItem from "@/components/ProductItem";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const ProductList: React.FC<Props> = async ({ params }) => {
  const { slug } = await params;

  const products = await fetchProductsFromCategory(slug);

  // Convert _id and any problematic fields to plain values
  const plainProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(), // Ensure _id is now a string
  }));

  return (
    <div className="flex flex-col items-center mt-6 p-4 ">
      <div className="flex md:flex-col gap-4 items-center justify-between md:justify-center mx-auto w-full">
        <h2 className="font-extrabold text-start text-2xl md:text-3xl text-primary uppercase drop-shadow-md">
          {slug as CategoriesType}
        </h2>
        {products &&
          products
            .slice(0, 1)
            .map((product, _index) => (
              <Image
                key={_index}
                src={`/images/categories/${product.category_image}.png`}
                alt={`Image for groceries from category ${product.category}`}
                width={140}
                height={140}
                priority
                className="object-cover object-center"
              />
            ))}
      </div>

      <div className="flex justify-between w-full">
        <GoToPage
          href={"/products"}
          className="self-end mt-4 mb-6 px-6 py-3 md:px-4 md:py-3 bg-secondary rounded-md hover:bg-primary hover:text-primary-foreground transition-opacity"
        >
          Back To All Products
        </GoToPage>
        <GoToPage
          href={"/shopping-list"}
          className="self-start mt-4 mb-6 px-6 py-3 md:px-4 md:py-3 bg-primary text-primary-foreground rounded-md hover:bg-secondary hover:text-secondary-foreground transition-opacity"
        >
          Shopping List
        </GoToPage>
      </div>

      <div className="flex flex-col w-full md:w-1/2 my-4">
        {products?.length === 0 && <NoData text={"No Data"} />}
        <ul>
          {plainProducts?.map((product) => (
            <li
              className="border-b border-border last:border-none mb-2 p-2"
              key={product._id}
            >
              <ProductItem product={product} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
