"use server";

import type { ProductPlain } from "@/lib/types";
import { Product as ProductSchema } from "@/lib/models/Product";
import { getUserData as getUserDataAction } from "@/lib/actions/getUserData";
import { ObjectId } from "mongoose";

export async function fetchShoppingListItems(): Promise<
  ProductPlain[] | undefined
> {
  try {
    const userData: {
      listItems: { productId: string; quantity: number; _id: ObjectId }[];
      _id: ObjectId;
    } = await getUserDataAction("listItems");

    // Extract the product IDs from the user's shopping list
    const productIds = userData.listItems?.map((item: any) => item.productId);

    // Query the database for products matching these IDs
    const products = await ProductSchema.find({
      _id: { $in: productIds },
    }).lean<ProductPlain[]>();

    // Enrich the products with quantities from the shopping list
    const enrichedProducts = products.map((product) => {
      const matchingItem = userData.listItems.find(
        (item) => item.productId.toString() === product._id.toString(),
      );
      return {
        ...product,
        _id: product._id.toString(),
        quantity: matchingItem?.quantity || 0,
      };
    });

    return enrichedProducts;
  } catch (error: any) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the shopping list products.");
  }
}
