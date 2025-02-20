import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    // Ensure `productId` is provided
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const userData = await getUser();

    if (!userData || !userData.email) {
      return NextResponse.json(
        { error: "User authentication failed" },
        { status: 401 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email: userData?.email });

    if (!user) {
      console.error("Error: User not found for email:", userData.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the product is already in the cart
    const itemIndex = user.listItems.findIndex(
      (item: { productId: ObjectId; quantity: number }) =>
        item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      // If product exists in cart, increment its quantity
      console.log(
        `Incrementing quantity for product ${productId} at index ${itemIndex}`,
      );

      user.listItems[itemIndex].quantity += 1;
    } else {
      // If product doesn't exist in cart, add it with quantity 1
      console.log("Adding new product to list:", productId);
      user.listItems.push({ productId, quantity: 1 });
    }

    await user.save();

    revalidatePath("/shopping-list");
    revalidatePath("/products/*");

    return NextResponse.json({
      success: true,
      updatedList: user.listItems,
    });
  } catch (error: any) {
    console.error("Error occurred in POST /shopping-list-add-items:", error);
    return NextResponse.json(
      { error: "An internal server error occurred", details: error.message },
      { status: 500 },
    );
  }
}
