// import { NextResponse } from "next/server";
// import { ProductPlain } from "@/lib/types";
// import { Product as ProductSchema } from "@/lib/models/Product";
// import { getUserData as getUserDataAction } from "@/lib/actions/getUserData";
//
// // This is your "GET" function handler
// export async function GET() {
//   try {
//     // Fetch user-specific shopping list items (IDs of items and their quantities)
//     const userData: { listItems: { productId: string; quantity: number }[] } =
//       await getUserDataAction("listItems");
//
//     if (!userData || !userData.listItems?.length) {
//       return NextResponse.json(
//         { message: "No shopping list items found." },
//         { status: 404 },
//       );
//     }
//
//     // Extract product IDs from the user's shopping list
//     const productIds = userData.listItems.map((item) => item.productId);
//
//     // Query the database for products matching the IDs
//     const products = await ProductSchema.find({
//       _id: { $in: productIds },
//     }).lean<ProductPlain[]>();
//
//     if (!products?.length) {
//       return NextResponse.json(
//         { message: "No products found for the shopping list." },
//         { status: 404 },
//       );
//     }
//
//     // Enrich products with quantities from the shopping list
//     const enrichedProducts = products.map((product) => {
//       const matchingItem = userData.listItems.find(
//         (item) => item.productId.toString() === product._id.toString(),
//       );
//
//       return {
//         ...product,
//         _id: product._id.toString(), // Ensure _id is converted to string
//         quantity: matchingItem?.quantity || 0,
//       };
//     });
//
//     return NextResponse.json(enrichedProducts, { status: 200 }); // Send enriched products as JSON response
//   } catch (error: any) {
//     console.error("API Error:", error.message, error.stack);
//     return NextResponse.json(
//       { message: "Failed to fetch shopping list products." },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";
import { getUser } from "@/lib/dal";

export async function GET() {
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

    return NextResponse.json(
      { listItems: userData.listItems, success: true, status: 200 },
      { status: 200 }, // Set standard HTTP success status
    );
  } catch (error: any) {
    console.error("API Error:", error.message, error.stack);
    return NextResponse.json(
      { message: "Failed to fetch shopping list products." },
      { status: 500 },
    );
  }
}
