"use server";

import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";
import type { Product as ProductType } from "@/lib/types";
import mongoose from "mongoose";

// FETCH ALL PRODUCTS
export async function fetchProducts() {
  try {
    if (!mongoose.connection.readyState) {
      await connectDB();
    }

    const products = await ProductSchema.find({}).lean<ProductType[]>();

    if (!products || products.length === 0) {
      // Error("No products found");
      return [];
    }

    return products;
  } catch (error) {
    console.log(error);
  }
}

// FETCH ALL CATEGORIES
export async function fetchAllCategories(): Promise<string[]> {
  try {
    if (!mongoose.connection.readyState) {
      await connectDB();
    }

    const categories =
      await ProductSchema.distinct("category").lean<string[]>();

    if (!categories || categories.length === 0) return [];

    return categories;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
}

// FETCH ALL PRODUCT FOR CATEGORY
export async function fetchProductsFromCategory(
  categoryName: string,
): Promise<ProductType[]> {
  try {
    await connectDB();

    const products = await ProductSchema.find({
      category: categoryName as string,
    }).lean<ProductType[]>();

    if (!products) {
      return [];
    }

    // Sorting by name A -> Z
    return products.sort((a, b) => {
      if (a.product_name < b.product_name) return -1;
      if (a.product_name > b.product_name) return 1;
      return 0;
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the products for specific category.");
  }
}

// FETCH LIST OF FAVORITES PRODUCTS
export async function fetchFavoritesProducts() {
  try {
    await connectDB();
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   throw new Error('User session not found');
    // }

    const allProducts = await fetchProducts();

    if (!allProducts) {
      throw new Error("Products not found");
    }

    // const user = await User.findOne({ email: session?.user?.email });

    // const productsFromFavoriteArray: Awaited<string[]> =
    //   await user?.likedProducts;

    // revalidatePath("/favorites", "page");

    // if (!productsFromFavoriteArray) {
    //   return [];
    // }

    // return allProducts?.filter((product) =>
    //   productsFromFavoriteArray.includes(product?._id.toString()),
    // );

    return []; // Todo: don't forget to remove this line of code.
  } catch (error) {
    console.error(error);
    throw error;
  }
}
