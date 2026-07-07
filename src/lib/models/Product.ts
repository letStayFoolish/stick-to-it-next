import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, "Category name is required"],
    },
    // A plain string for user-created items (always, displayed as-typed in
    // every locale) and for not-yet-migrated seeded items. Migrated seeded
    // items store a locale-keyed object ({ en, ru, sr, es, de }) instead;
    // see `resolveProductName` for how both shapes resolve to one display
    // string.
    product_name: {
      type: Schema.Types.Mixed,
      required: [true, "Product name is required"],
    },
    isLiked: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
  },
  { timestamps: true },
);

export const Product = models.Product || model("Product", ProductSchema);
