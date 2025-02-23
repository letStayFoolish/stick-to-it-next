import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    await connectDB();

    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }, // Not Found
      );
    }

    // Fetch the user's liked items (IDs of favorite products)
    const userData = await User.findOne({ email: user.email }).select(
      "listItems",
    );

    // If no userData is found, return a 404 response
    if (!userData) {
      return NextResponse.json(
        { error: "No user data found" },
        { status: 404 }, // Not Found
      );
    }

    userData.listItems = [];

    userData.save();

    revalidatePath("/shopping-list");
    return NextResponse.json(
      { success: true, status: 200 },
      { status: 200 }, // Set standard HTTP success status
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
