export const SUPPORTED_LOCALES = ["en", "ru", "sr", "es", "de"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE_NAME = "locale";

export function isSupportedLocale(
  value: string | undefined | null,
): value is Locale {
  return (
    !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export function resolveLocaleFromAcceptLanguage(
  header: string | null | undefined,
): Locale {
  if (!header) {
    return DEFAULT_LOCALE;
  }

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      const primary = tag.trim().split("-")[0].toLowerCase();
      return { primary, q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { primary } of ranked) {
    if (isSupportedLocale(primary)) {
      return primary;
    }
  }

  return DEFAULT_LOCALE;
}
