// Creating a Data Access Layer (DAL)

/**
 * We recommend creating a DAL to centralize your data requests and authorization logic.
 *
 * The DAL should include a function that verifies the user's session as they interact with your application.
 * At the very least, the function should check if the session is valid,
 * then redirect or return the user information needed to make further requests.
 */
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { decrypt } from "@/lib/session";
import { User } from "@/lib/models/User";
import connectDB from "@/lib/database";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  const session = await decrypt(cookie);

  if (!session || !session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});
/**
 * For secure checks, you can check if the session is valid by comparing the session ID with your database.
 * Use React's cache function to avoid unnecessary duplicate requests to the database during a render pass.
 */
export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session) return null;

  try {
    await connectDB();

    const user = await User.findOne({ _id: session.userId }).select(
      "-password",
    );

    if (!user) {
      throw new Error("User not authenticated");
    }

    return user;
  } catch (error: any) {
    console.log("Failed to fetch user", error);
    return null;
  }
});
