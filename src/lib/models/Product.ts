import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, "Category name is required"],
    },
    product_name: {
      type: String,
      required: [true, "Product name is required"],
    },
    product_image: {
      type: String,
      required: [true, "Product image is required"],
    },
    isLiked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Product = models.Product || model("Product", ProductSchema);
