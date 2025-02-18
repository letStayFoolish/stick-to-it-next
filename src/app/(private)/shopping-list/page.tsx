import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping List",
};

// const productsByCategories = {};

// const ShoppingList: React.FC = () => {
// if (!productsByCategories || Object.keys(productsByCategories).length === 0) {
//   return (
//     <section className="flex flex-col items-center p-4">
//       <div className="mb-4 px-3 py-4 text-center">
//         <PageHeading />
//         <span className="text-7xl">🥹</span>
//       </div>
//       <Image
//         // src={logo}
//         src={""}
//         alt="Cool shopping cart fool ofgroceries flying"
//         priority
//       />
//       <GoToPage
//         className="bg-secondary px-4 py-3 mb-6 md:mb-2 rounded-md hover:opacity-80 transition-opacity flex items-center w-fit"
//         href={"/"}
//       >{`Back To Home`}</GoToPage>
//     </section>
//   );
// }

// return (
//   <main className="flex flex-col items-center p-4 md:w-1/2 md:mx-auto">
//     <div className="mb-4 px-3 py-4">
//       <PageHeading />
//     </div>
//     <div className="w-full">
//       <GoToPage
//         className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-75 transition-all text-center"
//         href={"/products"}
//       >
//         {`Go Back To Products`}
//       </GoToPage>
//     </div>
{
  /*<ul className="w-full flex flex-col items-start mt-2 md:mt-6 px-3 pt-4 pb-6 bg-muted dark:bg-background rounded-md shadow-sm">*/
}
{
  /*{Object.entries(productsByCategories).map(([category, products]) => (*/
}
{
  /*  <li className="w-full" key={category}>*/
}
{
  /*    <div className="flex gap-4 lg:gap-7 items-center border-b-2 border-border last:border-none py-2 lg:py-3">*/
}
{
  /*      <Link href={`/products/${category}`}>*/
}
{
  /*        <Image*/
}
{
  /*          src={`/images/categories/${category}.png`}*/
}
{
  /*          alt={`Image for the groceries from the category ${category}`}*/
}
{
  /*          width={50}*/
}
{
  /*          height={50}*/
}
{
  /*          priority={true}*/
}
{
  /*          className="object-cover object-center lg:w-[80px]"*/
}
{
  /*        />*/
}
{
  /*      </Link>*/
}
{
  /*      <h3 className="uppercase text-lg md:text-xl font-medium lg:font-bold">*/
}
{
  /*        {category as CategoriesType}*/
}
{
  /*      </h3>*/
}
{
  /*    </div>*/
}
{
  /*    <ul className="w-full">*/
}
{
  /*      /!*{products?.map((Product) => (*!/*/
}
{
  /*      /!*  <li key={Product} className="border-b last:border-none">*!/*/
}
{
  /*      /!*    <ShoppingListItem Product={Product} />*!/*/
}
{
  /*      /!*  </li>*!/*/
}
{
  /*      /!*))}*!/*/
}
{
  /*    </ul>*/
}
{
  /*  </li>*/
}
{
  /*))}*/
}
{
  /*</ul>*/
}
{
  /*<Button*/
}
{
  /*  onClick={() => {*/
}
{
  /*    console.log("CLear all products from list");*/
}
{
  /*  }}*/
}
{
  /*  className="mt-4"*/
}
{
  /*>*/
}
{
  /*  Clear All*/
}
{
  /*</Button>*/
}
{
  /*</main>*/
}
{
  /*);*/
}
{
  /*};*/
}

// export default ShoppingList;

const ShoppingList: React.FC = async () => {
  return <main>ShoppingList</main>;
};

export default ShoppingList;
