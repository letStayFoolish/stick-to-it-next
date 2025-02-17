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
    listItems: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },

    image: { type: String },
    //   TODO:
    // image
    // emailVerified,
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
