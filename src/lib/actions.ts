"use server";

import connectDB from "@/lib/database";
import { FormState, SigninFormSchema, SignupFormSchema } from "@/lib/types";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";

// HANDLE BASE URL
export async function getBaseURL() {
  if (typeof window !== "undefined") return "";

  return process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
}

// SIGN UP ACTION
export async function signupAction(state: FormState, formData: FormData) {
  try {
    const validatedFields = SignupFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await connectDB();

    // Check if email already exists in db
    const isUserExists = await User.findOne({
      email: validatedFields.data.email,
    });

    if (isUserExists) {
      return { error: "Email already in use" };
    }

    const { name, email, password } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      image: "",
      likedItems: [],
      listItems: [],
    });

    // Return success or throw error to the calling client
    if (user) {
      await createSession(user._id.toString());

      return { success: true };
    } else {
      if (user.status === 409) {
        return { error: "Email already in use" };
      }

      return { error: "An error occurred while creating your account." };
    }
  } catch (error: any) {
    console.error(error);
  }
}

// LOGOUT ACTION
export async function logout() {
  await deleteSession();
}

// SIGN IN ACTION
export async function signinAction(state: FormState, formData: FormData) {
  try {
    const validatedFields = SigninFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await connectDB();

    const user = await User.findOne({
      email: validatedFields.data.email,
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    const passwordMatches = await bcrypt.compare(
      validatedFields.data.password,
      user.password,
    );

    if (!passwordMatches) {
      return { error: "Invalid credentials" };
    }

    // Return success or throw error to the calling client
    if (user && passwordMatches) {
      await createSession(user._id.toString());

      return { success: true };
    }

    return { error: "Login failed." };
  } catch (error: any) {
    console.error(error);
  }
}
