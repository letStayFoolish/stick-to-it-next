import { ObjectId } from "mongoose";
import { z } from "zod";

export type ObjectKeys<T> = keyof T;

export interface Product {
  _id: ObjectId;
  product_name: string;
  category: string;
  isLiked?: boolean;
  owner?: ObjectId | string | null;
}

export interface ProductPlain extends Omit<Product, "_id"> {
  _id: string;
  quantity?: number;
  checked?: boolean;
}

export type UserInfo = {
  name: string;
  email: string;
  password: string;
  likedItems?: string[];
  listItems?: string[];
};

type Translate = (key: string) => string;

export function createSignupFormSchema(t: Translate) {
  return z.object({
    name: z.string().min(2, { message: t("nameMin") }).trim(),
    email: z.string().email({ message: t("emailInvalid") }).trim(),
    password: z
      .string()
      .min(8, { message: t("passwordMin") })
      .regex(/[a-zA-Z]/, { message: t("passwordLetter") })
      .regex(/[0-9]/, { message: t("passwordNumber") })
      .regex(/[^a-zA-Z0-9]/, { message: t("passwordSpecial") })
      .trim(),
  });
}

export function createSigninFormSchema(t: Translate) {
  return z.object({
    email: z.string().email({ message: t("emailInvalid") }).trim(),
    password: z
      .string()
      .min(8, { message: t("passwordMin") })
      .regex(/[a-zA-Z]/, { message: t("passwordLetter") })
      .regex(/[0-9]/, { message: t("passwordNumber") })
      .regex(/[^a-zA-Z0-9]/, { message: t("passwordSpecial") })
      .trim(),
  });
}

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

export const CATEGORIES = [
  "bakery",
  "vegetables",
  "fruits",
  "meat",
  "milk-eggs-cheese",
  "water-juice",
  "fish",
  "drinks",
  "chips-snacks",
  "sweets",
  "frozen",
  "pasta-cereals-flour",
  "oil-sauces-spices",
  "tea-coffee-cocoa",
  "cleaning",
  "house-kitchen",
  "canned-food",
  "health-beauty",
  "kids-parents",
  "animals",
  "else",
] as const;

export type CategoriesType = (typeof CATEGORIES)[number];

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
