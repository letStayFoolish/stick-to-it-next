import { describe, expect, it } from "vitest";
import { handleProductName } from "@/lib/utils";

describe("handleProductName", () => {
  it("replaces hyphens with a comma and space", () => {
    expect(handleProductName("apple-juice")).toBe("apple, juice");
  });
});
