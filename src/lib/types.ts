import { ObjectId } from "mongoose";

export type ObjectKeys<T> = keyof T;

export interface Product {
  _id: ObjectId;
  product_name: string;
  product_image?: string;
  category_image: string;
  category: string;
  isLiked?: boolean;
}

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
