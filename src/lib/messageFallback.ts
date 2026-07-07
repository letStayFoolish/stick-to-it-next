import enMessages from "../../messages/en.json";

function getNestedValue(obj: unknown, path: string[]): unknown {
  return path.reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * next-intl calls this whenever a key is missing from the active locale's
 * catalog. Falls back to the English value so the app never shows a raw
 * key or blank string; if English is missing it too (shouldn't happen —
 * the key-parity test guards against catalog drift), the key is returned.
 */
export function resolveMessageFallback({ key }: { key: string }): string {
  const fallback = getNestedValue(enMessages, key.split("."));
  return typeof fallback === "string" ? fallback : key;
}
