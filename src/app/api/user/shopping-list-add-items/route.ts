import { getUser } from "@/lib/dal";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    const userData = await getUser();

    await connectDB();

    const user = await User.findOne({ email: userData?.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the Product is already added to shopping list
    const isInShoppingList = await user.listItems.includes(productId);

    if (isInShoppingList) {
      user.listItems = user.listItems.filter(
        (id: string) => id !== productId,
      ) as string[];
    } else {
      user.listItems.push(productId);
    }

    await user.save();
    revalidatePath("/shopping-list");
    return NextResponse.json({ success: true, isAdded: !isInShoppingList });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
