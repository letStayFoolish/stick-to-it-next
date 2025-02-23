"use server";

import connectDB from "@/lib/database";
import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";

export async function getUserData() {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const userData = await User.findOne({ email: user.email });
    // const userData = await User.findOne({ email: user.email }).lean();

    if (!userData) {
      console.log("User record not found in database.");
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Database Error:", error);
  }
}
