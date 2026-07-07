import mongoose from "mongoose";
import { SUPPORTED_LOCALES } from "@/lib/locale";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedItems: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
    listItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        checked: { type: Boolean, default: false },
      },
    ],
    image: { type: String },
    notes: { type: String, default: "" },
    language: { type: String, enum: SUPPORTED_LOCALES, required: false },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
