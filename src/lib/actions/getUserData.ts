"use server";

import connectDB from "@/lib/database";
import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";

export async function getUserData(data: "listItems" | "likedItems" | "") {
  await connectDB();

  let userData;

  const user = await getUser();

  if (!user) return null;

  // Fetch the user's liked items (IDs of favorite products)
  if (data) {
    userData = await User.findOne({ email: user.email }).select(data);
  } else {
    userData = await User.findOne({ email: user.email });
  }

  if (!userData || userData.listItems?.length === 0) {
    console.log("User has no shopping list items");
    userData = [];
  }

  return userData;
}
