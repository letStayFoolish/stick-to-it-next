import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return user.likedItems || [];

    // return category products but handle `isLiked` according user liked items
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
