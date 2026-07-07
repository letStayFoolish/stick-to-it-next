import { describe, expect, it } from "vitest";
import { resolveMessageFallback } from "@/lib/messageFallback";

describe("resolveMessageFallback", () => {
  it("returns the English value for a key missing from another locale's catalog", () => {
    expect(
      resolveMessageFallback({ key: "ShoppingListPage.heading" }),
    ).toBe("Shopping List");
  });

  it("returns the key itself when even English has no value (last-resort guard)", () => {
    expect(resolveMessageFallback({ key: "Nowhere.reallyMissing" })).toBe(
      "Nowhere.reallyMissing",
    );
  });
});
