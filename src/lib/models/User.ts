import mongoose from "mongoose";

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
      },
    ],
    image: { type: String },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
