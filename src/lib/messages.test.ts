import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import sr from "../../messages/sr.json";
import es from "../../messages/es.json";
import de from "../../messages/de.json";
import { SUPPORTED_LOCALES } from "@/lib/locale";

const catalogs: Record<string, unknown> = { en, ru, sr, es, de };

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) {
    return [prefix];
  }

  return Object.entries(obj).flatMap(([key, value]) =>
    keyPaths(value, prefix ? `${prefix}.${key}` : key),
  );
}

describe("message catalogs", () => {
  it("have a catalog file for every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(catalogs[locale]).toBeDefined();
    }
  });

  it("share an identical key set across every locale (fallback-to-en guard)", () => {
    const englishKeys = keyPaths(en).sort();

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === "en") continue;
      expect(keyPaths(catalogs[locale]).sort()).toEqual(englishKeys);
    }
  });
});
