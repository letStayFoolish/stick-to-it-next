import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json(); // Get productId from request body

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectDB(); // Connect to the database

    const userData = await getUser();

    if (!userData || !userData.email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const user = await User.findOne({ email: userData.email }).select(
      "listItems",
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove the item from the shopping list
    user.listItems = user.listItems.filter(
      (item: any) => item.productId.toString() !== productId,
    );

    // Save changes to the database
    await user.save();

    // Trigger revalidation if necessary
    revalidatePath("/shopping-list");
    revalidatePath("/products/*");

    return NextResponse.json(
      { success: true, updatedList: user.listItems },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error removing item from shopping list:", error);

    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
