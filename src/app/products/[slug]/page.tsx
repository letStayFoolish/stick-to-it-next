import React, { Suspense } from "react";
import type {
  CategoriesType,
  ComponentPropsWithParams,
  ProductPlain,
} from "@/lib/types";
import Image from "next/image";
import GoToPage from "@/components/GoToPage";
import { handleProductName } from "@/lib/utils";
import PageHeading from "@/components/PageHeading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetchProductsFromCategory as fetchProductsFromCategoryAction } from "@/lib/actions/fetchProductsFromCategory";
import ProductItem from "@/components/Product/ProductItem";
import NoData from "@/components/ui/NoData";

const ProductList: React.FC<{ products: ProductPlain[] }> = ({ products }) => {
  return (
    <div className="flex flex-col w-full my-4 lg:w-2/3">
      <ul className="mx-auto w-full">
        {products?.map((product) => (
          <li
            className="border-b border-border last:border-none p-2 w-full"
            key={product._id}
          >
            <ProductItem product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Products: React.FC<ComponentPropsWithParams> = async ({ params }) => {
  const { slug } = await params;

  const products = await fetchProductsFromCategoryAction(slug);

  return (
    <div className="flex flex-col items-center mt-6 p-4 overflow-x-hidden">
      <div className="flex md:flex-col gap-4 items-center justify-between md:justify-center mx-auto w-full">
        <PageHeading>
          {handleProductName(slug as CategoriesType).toUpperCase()}
        </PageHeading>
        {products &&
          products
            .slice(0, 1)
            .map((product) => (
              <Image
                key={product._id}
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
          className="self-end mt-4 mb-6 px-4 py-3 md:py-3 bg-secondary rounded-md hover:bg-primary hover:text-primary-foreground transition-opacity"
        >
          Back To All Products
        </GoToPage>
        <GoToPage
          href={"/shopping-list"}
          className="self-start mt-4 mb-4 px-6 py-3 md:py-3 bg-primary text-primary-foreground rounded-md hover:bg-secondary hover:text-secondary-foreground transition-opacity"
        >
          Shopping List
        </GoToPage>
      </div>
      <Suspense
        fallback={
          <div className="flex gap-4 items-center justify-center">
            <LoadingSpinner />
            <p>Loading Products...</p>
          </div>
        }
      >
        {products ? (
          <ProductList products={products} />
        ) : (
          <NoData text={"No products found"} />
        )}
      </Suspense>
    </div>
  );
};

export default Products;
