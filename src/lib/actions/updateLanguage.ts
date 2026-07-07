"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import connectDB from "@/lib/database";
import * as userService from "@/lib/services/userService";
import { isSupportedLocale, LOCALE_COOKIE_NAME } from "@/lib/locale";

export type LanguageActionState = {
  success: boolean;
  message?: string;
};

export async function updateLanguage(
  prevState: LanguageActionState | undefined,
  formData: FormData,
): Promise<LanguageActionState> {
  const language = formData.get("language") as string;

  if (!isSupportedLocale(language)) {
    return { success: false, message: "Unsupported language" };
  }

  const auth = await requireUser();

  if (!auth.authenticated) {
    return { success: false, message: "Not authenticated" };
  }

  await connectDB();
  await userService.setLanguage(auth.userId, language);

  (await cookies()).set(LOCALE_COOKIE_NAME, language, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");

  return { success: true };
}
