import React from "react";
import type { CategoriesType, ComponentPropsWithParams } from "@/lib/types";
import Image from "next/image";
import GoToPage from "@/components/GoToPage";
import { handleProductName } from "@/lib/utils";
import ProductList from "@/components/Product/ProductList";
import { fetchProductsFromCategory } from "@/lib/actions";

const Products: React.FC<ComponentPropsWithParams> = async ({ params }) => {
  const { slug } = await params;
  const products = await fetchProductsFromCategory(slug); // await here or pass promise as props to a client component, and use them using React's `use` hook.
  const heading: string = handleProductName(slug as CategoriesType);

  return (
    <div className="flex flex-col items-center mt-6 p-4 ">
      <div className="flex md:flex-col gap-4 items-center justify-between md:justify-center mx-auto w-full">
        <h2 className="font-extrabold text-start text-2xl md:text-3xl text-primary uppercase drop-shadow-md">
          {heading}
        </h2>
        {products &&
          products.slice(0, 1).map((product, _index) => (
            <Image
              key={_index}
              src={`/images/categories/${product.category_image}.png`}
              alt={`Image for groceries from category ${product.category}`}
              width={140}
              height={140}
              // placeholder="blur" // Optional blur-up while loading
              // blurDataURL={`/images/categories/${product.category_image}.png`}
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
      <ProductList selectedCategory={slug} />
    </div>
  );
};

export default Products;
