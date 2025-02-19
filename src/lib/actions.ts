"use server";

import connectDB from "@/lib/database";
import { Product as ProductSchema } from "@/lib/models/Product";
import {
  FormState,
  Product as ProductType,
  ProductPlain,
  SigninFormSchema,
  SignupFormSchema,
} from "@/lib/types";
import mongoose from "mongoose";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { getUser } from "@/lib/dal";
import { revalidatePath } from "next/cache";

// const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000/";

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
): Promise<ProductPlain[]> {
  try {
    await connectDB();

    const products = await ProductSchema.find({
      category: categoryName as string,
    }).lean<ProductType[]>();

    if (!products) {
      return [];
    }

    const userEmail = (await getUser())?.email ?? null;

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
export async function fetchFavoritesProducts() {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) return null;

    // Fetch the user's liked items (IDs of favorite products)
    const userData = await User.findOne({ email: user.email }).select(
      "likedItems",
    );

    const favoriteProducts: string[] = userData?.likedItems?.map(String) || []; // Ensure it's an array of strings

    if (favoriteProducts.length === 0) return []; // User has no liked items

    const allProducts = await fetchProducts();

    if (!allProducts || allProducts.length === 0) return [];

    const result = allProducts.filter((product) =>
      favoriteProducts.includes(String(product._id)),
    );

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the products for specific category.");
  }
}

// SIGN UP ACTION
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

    await connectDB();

    // Check if email already exists in db
    const isUserExists = await User.findOne({
      email: validatedFields.data.email,
    });

    if (isUserExists) {
      return { error: "Email already in use" };
    }

    const { name, email, password } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      image: "",
      likedItems: [],
      listItems: [],
    });

    // Return success or throw error to the calling client
    if (user) {
      await createSession(user._id.toString());

      return { success: true };
    } else {
      if (user.status === 409) {
        return { error: "Email already in use" };
      }

      return { error: "An error occurred while creating your account." };
    }
  } catch (error: any) {
    console.error(error);
  }
}

// LOGOUT ACTION
export async function logout() {
  await deleteSession();
}

// SIGN IN ACTION
export async function signinAction(state: FormState, formData: FormData) {
  try {
    const validatedFields = SigninFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await connectDB();

    const user = await User.findOne({
      email: validatedFields.data.email,
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    const passwordMatches = await bcrypt.compare(
      validatedFields.data.password,
      user.password,
    );

    if (!passwordMatches) {
      return { error: "Invalid credentials" };
    }

    // Return success or throw error to the calling client
    if (user && passwordMatches) {
      await createSession(user._id.toString());

      return { success: true };
    }

    return { error: "Login failed." };
  } catch (error: any) {
    console.error(error);
  }
}

// REMOVE PRODUCT(S) FROM FAVORITES (ON PROFILE PAGE)
export async function handleDislike(productId: string) {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) return null;

    // Fetch the user's liked items (IDs of favorite products)
    const userData = await User.findOne({ email: user.email }).select(
      "likedItems",
    );

    if (!userData) return null;

    const favoriteProducts: string[] = userData?.likedItems?.map(String) || []; // Ensure it's an array of strings

    const updatedFavoriteProducts: string[] = favoriteProducts.filter(
      (id: string) => id !== productId,
    );

    if (updatedFavoriteProducts) {
      userData.likedItems = updatedFavoriteProducts;
    }

    revalidatePath("/profile");

    userData.save();
  } catch (error: any) {
    console.error(error);
  }
}

// ADD ITEMS TO SHOPPING LIST BY CLICKING ON CART
export async function fetchShoppingListItems(): Promise<
  ProductPlain[] | undefined
> {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) return;

    // Fetch the user's liked items (IDs of favorite products)
    const userData = await User.findOne({ email: user.email }).select(
      "listItems",
    );

    const shoppingListItems: string[] = userData?.listItems?.map(String) || []; // Ensure it's an array of strings

    if (shoppingListItems.length === 0) return []; // User has no liked items

    const allProducts = await fetchProducts();

    if (!allProducts || allProducts.length === 0) return [];

    const result = allProducts.filter((product) =>
      shoppingListItems.includes(String(product._id)),
    );

    const enrichedProducts = result.map((product) => ({
      ...product,
      _id: String(product._id),
    }));

    // return result;
    if (!enrichedProducts) {
      return [];
    }

    return enrichedProducts;
  } catch (error: any) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the shopping list products.");
  }
}

// REMOVE ITEM(S) FROM SHOPPING LIST
export async function handleRemoveFromShoppingList(productId: string) {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) return null;

    // Fetch the user's liked items (IDs of favorite products)
    const userData = await User.findOne({ email: user.email }).select(
      "listItems",
    );

    if (!userData) return null;

    const shoppingListItems: string[] = userData?.listItems?.map(String) || []; // Ensure it's an array of strings

    if (shoppingListItems.length === 0) return []; // User has no liked items

    const updatedShoppingList = shoppingListItems.filter(
      (id: string) => id !== productId,
    );

    if (updatedShoppingList) {
      userData.listItems = updatedShoppingList;
    }

    userData.save();
    revalidatePath("/shopping-list");
  } catch (error: any) {
    console.error(error);
  }
}

// CHECK IF ITEM IS ALREADY ADDED TO SHOPPING LIST (BUTTON DISABLED)
export async function checkIsItemAdded(productId: string) {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) return null;

    // Fetch the user's liked items (IDs of favorite products)
    const userData = await User.findOne({ email: user.email }).select(
      "listItems",
    );

    if (!userData) return null;

    const shoppingListItems: string[] = userData?.listItems?.map(String) || []; // Ensure it's an array of strings

    if (shoppingListItems.length === 0) return null; // User has no liked items

    const result = shoppingListItems.indexOf(productId);

    return result !== -1;
  } catch (error: any) {
    console.error(error);
  }
}
