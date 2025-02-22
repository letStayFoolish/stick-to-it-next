"use server";

import connectDB from "@/lib/database";
import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";
import { revalidatePath } from "next/cache";

export async function clearProducts() {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) return null;

    // Fetch the user's liked items (IDs of favorite products)
    const userData = await User.findOne({ email: user.email }).select(
      "listItems",
    );

    if (!userData) return null;

    userData.listItems = [];

    userData.save();

    revalidatePath("/shopping-list");
  } catch (error: any) {
    console.error(error);
  }
}
