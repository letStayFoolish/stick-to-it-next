import React from "react";
import GoToPage from "@/components/GoToPage";
import HomePageCategories from "@/app/(home)/components/HomePageCategories";
import type { Metadata } from "next";
import HomePageHeading from "@/app/(home)/components/HomePageHeading";

export const metadata: Metadata = {
  title: "Home",
};

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col items-center p-4">
      <HomePageHeading />
      <HomePageCategories />
      <GoToPage
        href="/products"
        className="mt-6 mb-12 bg-primary text-primary-foreground rounded-md text-xl px-6 py-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out"
      >
        Browse Products
      </GoToPage>
    </main>
  );
};

export default HomePage;
