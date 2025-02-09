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
