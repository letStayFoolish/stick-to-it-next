import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type {
  CategoriesType,
  ComponentPropsWithParams,
  ProductPlain,
} from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import GoToPage from "@/components/GoToPage";
import PageHeading from "@/components/PageHeading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetchProductsFromCategory as fetchProductsFromCategoryAction } from "@/lib/actions/fetchProductsFromCategory";
import ProductItem from "@/components/Product/ProductItem";
import NoData from "@/components/ui/NoData";
import Pagination from "@/components/Pagination";
import { paginate } from "@/lib/pagination";

const PAGE_SIZE = 10;

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

type Props = ComponentPropsWithParams & {
  searchParams: Promise<{ page?: string }>;
};

const Products: React.FC<Props> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { page } = await searchParams;

  const [products, t, tCategories] = await Promise.all([
    fetchProductsFromCategoryAction(slug),
    getTranslations("Products"),
    getTranslations("Categories"),
  ]);
  const {
    items: pageOfProducts,
    currentPage,
    totalPages,
  } = paginate(products ?? [], Number(page) || 1, PAGE_SIZE);

  return (
    <div className="flex flex-col items-center mt-6 p-4 overflow-x-hidden">
      <div className="flex md:flex-col gap-4 items-center justify-between md:justify-center mx-auto w-full">
        <PageHeading>
          {tCategories(slug as CategoriesType).toUpperCase()}
        </PageHeading>
        <CategoryIcon category={slug} size="lg" />
      </div>

      <div className="flex justify-between w-full">
        <GoToPage
          href={"/products"}
          className="self-end mt-4 mb-6 px-4 py-3 md:py-3 bg-secondary rounded-md hover:bg-primary hover:text-primary-foreground transition-opacity"
        >
          {t("backToAllProducts")}
        </GoToPage>
        <GoToPage
          href={"/shopping-list"}
          className="self-start mt-4 mb-4 px-6 py-3 md:py-3 bg-primary text-primary-foreground rounded-md hover:bg-secondary hover:text-secondary-foreground transition-opacity"
        >
          {t("shoppingList")}
        </GoToPage>
      </div>
      <Suspense
        fallback={
          <div className="flex gap-4 items-center justify-center">
            <LoadingSpinner />
            <p>{t("loadingProducts")}</p>
          </div>
        }
      >
        {products?.length ? (
          <>
            <ProductList products={pageOfProducts} />
            <Pagination
              basePath={`/products/${slug}`}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        ) : (
          <NoData text={t("noProductsFound")} />
        )}
      </Suspense>
    </div>
  );
};

export default Products;
