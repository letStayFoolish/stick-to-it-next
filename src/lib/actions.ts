"use server";

import connectDB from "@/lib/database";
import {
  createSigninFormSchema,
  createSignupFormSchema,
  FormState,
} from "@/lib/types";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";
import { createSession, deleteSession } from "@/lib/session";
import { syncLocaleCookieForUser } from "@/lib/localeCookie";

// HANDLE BASE URL
export async function getBaseURL() {
  if (typeof window !== "undefined") return "";

  return process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
}

// SIGN UP ACTION
export async function signupAction(state: FormState, formData: FormData) {
  try {
    const [tValidation, tAuth] = await Promise.all([
      getTranslations("Validation"),
      getTranslations("Auth"),
    ]);

    const validatedFields = createSignupFormSchema(tValidation).safeParse({
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
      return { error: tAuth("emailInUse") };
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
      notes: "",
    });

    // Return success or throw error to the calling client
    if (user) {
      await createSession(user._id.toString());
      await syncLocaleCookieForUser(user._id.toString(), user.language);

      return { success: true };
    } else {
      if (user.status === 409) {
        return { error: tAuth("emailInUse") };
      }

      return { error: tAuth("signupError") };
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
    const [tValidation, tAuth] = await Promise.all([
      getTranslations("Validation"),
      getTranslations("Auth"),
    ]);

    const validatedFields = createSigninFormSchema(tValidation).safeParse({
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
      return { error: tAuth("invalidCredentials") };
    }

    const passwordMatches = await bcrypt.compare(
      validatedFields.data.password,
      user.password,
    );

    if (!passwordMatches) {
      return { error: tAuth("invalidCredentials") };
    }

    // Return success or throw error to the calling client
    if (user && passwordMatches) {
      await createSession(user._id.toString());
      await syncLocaleCookieForUser(user._id.toString(), user.language);

      return { success: true };
    }

    return { error: tAuth("loginFailed") };
  } catch (error: any) {
    console.error(error);
  }
}
