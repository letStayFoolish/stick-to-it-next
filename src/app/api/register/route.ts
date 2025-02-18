import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: any) {
  try {
    console.log({ req });

    const { name, email, password } = await req.json();

    await connectDB();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists in db
    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return NextResponse.json(
        {
          message:
            "User with that email already exists in database. Please chose another email address and try again.",
        },
        { status: 409 },
      );
    }

    await User.create({
      name,
      email,
      password: hashedPassword,
      image: "",
      likedItems: [],
      listItems: [],
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while reistring the user.",
      },
      { status: 500 },
    );
  }
}
