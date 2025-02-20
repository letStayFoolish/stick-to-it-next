import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectDB(); // Connect to database

    const userData = await getUser();

    if (!userData || !userData.email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Find the user
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the item in the user's shopping list
    const itemIndex = user.listItems.findIndex(
      (item: any) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      user.listItems[itemIndex].quantity = Math.min(
        100,
        user.listItems[itemIndex].quantity + 1,
      );
    } else {
      // If the item doesn't exist in the list, return an error
      return NextResponse.json(
        { error: "Item not found in shopping list" },
        { status: 404 },
      );
    }

    await user.save(); // Save changes to the database

    revalidatePath("/shopping-list");

    return NextResponse.json(
      { success: true, updatedList: user.listItems },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
