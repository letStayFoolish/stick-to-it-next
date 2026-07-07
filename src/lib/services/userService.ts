import { User as UserSchema } from "@/lib/models/User";
import type { Locale } from "@/lib/locale";

export async function setLanguage(
  userId: string,
  language: Locale,
): Promise<void> {
  await UserSchema.updateOne({ _id: userId }, { language });
}

export async function getLanguage(userId: string): Promise<Locale | null> {
  const user = await UserSchema.findById(userId)
    .select("language")
    .lean<{ language?: Locale }>();

  return user?.language ?? null;
}
