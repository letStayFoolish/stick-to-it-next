import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, userEmail } = await req.json();

    await connectDB();

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the Product is already liked
    const isLiked = user.likedItems.includes(productId);

    if (isLiked && user.likedItems.length > 0) {
      user.likedItems = (user.likedItems as string[]).filter(
        (id) => id.toString() !== productId,
      );
    } else {
      user.likedItems.push(productId);
    }

    await user.save();
    return NextResponse.json({ success: true, liked: !isLiked });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
