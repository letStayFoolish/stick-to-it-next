"use server";

import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";
import {
  FormState,
  Product as ProductType,
  ProductPlain,
  SignupFormSchema,
} from "@/lib/types";
import mongoose from "mongoose";
import { User } from "@/lib/models/User";

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

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
  userEmail?: string,
): Promise<ProductPlain[]> {
  try {
    await connectDB();

    const products = await ProductSchema.find({
      category: categoryName as string,
    }).lean<ProductType[]>();

    if (!products) {
      return [];
    }

    let likedItems: string[] = [];

    if (userEmail) {
      const user = await User.findOne({ email: userEmail }).select(
        "likedItems",
      );

      if (user && user.likedItems) {
        likedItems = user.likedItems.map(String); // Convert ObjectId to string for easier comparison
      }
    }

    // Add 'isLiked' flag to products based on likedItems
    const enrichedProducts = products.map((product) => ({
      ...product,
      _id: String(product._id),
      isLiked: likedItems.includes(String(product._id)),
    }));

    // Sort by liked status, then alphabetical order
    return enrichedProducts.sort((a, b) => {
      if (a.isLiked && !b.isLiked) return -1; // Liked products first
      if (!a.isLiked && b.isLiked) return 1;
      if (a.product_name < b.product_name) return -1; // A-Z sorting
      if (a.product_name > b.product_name) return 1;
      return 0;
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the products for specific category.");
  }
}

// FETCH LIST OF FAVORITES PRODUCTS

// Signup action
export async function signupAction(state: FormState, formData: FormData) {
  try {
    const validatedFields = SignupFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    console.log({ validatedFields });

    const response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    // Return success or throw error to the calling client
    if (response.ok) {
      return { success: true };
    } else {
      if (response.status === 409) {
        return { error: "Email already in use" };
      }

      return { error: "Registration failed." };
    }
  } catch (error: any) {
    console.error(error);
  }
}
