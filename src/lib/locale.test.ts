import { describe, expect, it } from "vitest";
import {
  isSupportedLocale,
  resolveLocaleFromAcceptLanguage,
  SUPPORTED_LOCALES,
} from "@/lib/locale";

describe("resolveLocaleFromAcceptLanguage", () => {
  it("returns the default locale when the header is missing", () => {
    expect(resolveLocaleFromAcceptLanguage(null)).toBe("en");
  });

  it("picks a supported locale that matches the header exactly", () => {
    expect(resolveLocaleFromAcceptLanguage("ru")).toBe("ru");
  });

  it("matches the primary subtag of a region-qualified tag (ru-RU)", () => {
    expect(resolveLocaleFromAcceptLanguage("ru-RU,ru;q=0.9")).toBe("ru");
  });

  it("falls back to the default locale for an unsupported language", () => {
    expect(resolveLocaleFromAcceptLanguage("fr-FR,fr;q=0.9")).toBe("en");
  });

  it("skips an unsupported higher-priority language for a supported lower-priority one", () => {
    expect(resolveLocaleFromAcceptLanguage("fr;q=0.9,de;q=0.5")).toBe("de");
  });

  it("respects q-value ordering across multiple supported locales", () => {
    expect(resolveLocaleFromAcceptLanguage("es;q=0.5,de;q=0.9")).toBe("de");
  });
});

describe("isSupportedLocale", () => {
  it("accepts every member of SUPPORTED_LOCALES", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(isSupportedLocale(locale)).toBe(true);
    }
  });

  it("rejects an unsupported or missing value", () => {
    expect(isSupportedLocale("fr")).toBe(false);
    expect(isSupportedLocale(null)).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
  });
});
