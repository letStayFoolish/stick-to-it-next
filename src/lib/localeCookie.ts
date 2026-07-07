import "server-only";
import { cookies, headers } from "next/headers";
import { User } from "@/lib/models/User";
import {
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  resolveLocaleFromAcceptLanguage,
} from "@/lib/locale";

/**
 * Called at login/signup so a fresh device immediately renders in the
 * account's stored language instead of waiting for a client round trip.
 * Backfills `language` from Accept-Language for accounts that predate
 * this preference (or a first-time signup) so it's DB-backed from then on.
 */
export async function syncLocaleCookieForUser(
  userId: string,
  storedLanguage?: string | null,
) {
  let language = storedLanguage;

  if (!isSupportedLocale(language)) {
    language = resolveLocaleFromAcceptLanguage(
      (await headers()).get("accept-language"),
    );
    await User.updateOne({ _id: userId }, { language });
  }

  (await cookies()).set(LOCALE_COOKIE_NAME, language, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
