// Creating a Data Access Layer (DAL)

/**
 * We recommend creating a DAL to centralize your data requests and authorization logic.
 *
 * The DAL should include a function that verifies the user's session as they interact with your application.
 * At the very least, the function should check if the session is valid,
 * then redirect or return the user information needed to make further requests.
 */
import "server-only";

import { cache } from "react";
import { requireUser } from "@/lib/session";
import { User } from "@/lib/models/User";
import connectDB from "@/lib/database";

/**
 * For secure checks, you can check if the session is valid by comparing the session ID with your database.
 * Use React's cache function to avoid unnecessary duplicate requests to the database during a render pass.
 */
export const getUser = cache(async () => {
  const auth = await requireUser();

  if (!auth.authenticated) return null;

  try {
    await connectDB();

    const user = await User.findOne({ _id: auth.userId }).select("-password");

    if (!user) {
      throw new Error("User not authenticated");
    }

    return user;
  } catch (error: any) {
    console.log("Failed to fetch user", error);
    return null;
  }
});
