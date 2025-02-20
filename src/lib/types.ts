import { ObjectId } from "mongoose";
import { z } from "zod";

export type ObjectKeys<T> = keyof T;

export interface Product {
  _id: ObjectId;
  product_name: string;
  product_image?: string;
  category_image: string;
  category: string;
  isLiked?: boolean;
}

export interface ProductPlain extends Omit<Product, "_id"> {
  _id: string;
  quantity?: number;
}

export type UserInfo = {
  name: string;
  email: string;
  password: string;
  likedItems?: string[];
  listItems?: string[];
};

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const SigninFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type CategoriesType =
  | "bakery"
  | "vegetables"
  | "fruits"
  | "meat"
  | "milk-eggs-cheese"
  | "water-juice"
  | "fish"
  | "drinks"
  | "chips-snacks"
  | "sweets"
  | "frozen"
  | "pasta-cereals-flour"
  | "oil-sauces-spices"
  | "tea-coffee-cocoa"
  | "cleaning"
  | "house-kitchen"
  | "canned-food"
  | "health-beauty"
  | "kids-parents"
  | "animals";

export type ComponentPropsWithParams = {
  params: Promise<{
    slug: string;
  }>;
};

export type TUser = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  likedItems: string[];
};
