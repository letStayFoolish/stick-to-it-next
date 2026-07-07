import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  resolveLocaleFromAcceptLanguage,
} from "@/lib/locale";
import { resolveMessageFallback } from "@/lib/messageFallback";

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;

  const locale = isSupportedLocale(cookieLocale)
    ? cookieLocale
    : resolveLocaleFromAcceptLanguage(
        (await headers()).get("accept-language"),
      );

  return {
    locale: locale ?? DEFAULT_LOCALE,
    messages: (await import(`../../messages/${locale}.json`)).default,
    getMessageFallback: resolveMessageFallback,
    onError(error) {
      if (error.code !== "MISSING_MESSAGE") {
        console.error(error);
      }
    },
  };
});
