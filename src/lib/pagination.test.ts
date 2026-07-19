import { describe, expect, it } from "vitest";
import { parsePageSize, paginate } from "@/lib/pagination";

describe("paginate", () => {
  it("slices the requested page and reports total pages", () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);

    const result = paginate(items, 2, 10);

    expect(result.items).toEqual(Array.from({ length: 10 }, (_, i) => i + 11));
    expect(result.currentPage).toBe(2);
    expect(result.totalPages).toBe(3);
  });

  it("clamps a page number below 1 up to the first page", () => {
    const items = [1, 2, 3];

    const result = paginate(items, 0, 10);

    expect(result.currentPage).toBe(1);
    expect(result.items).toEqual([1, 2, 3]);
  });

  it("clamps a page number past the last page down to the last page", () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);

    const result = paginate(items, 99, 10);

    expect(result.currentPage).toBe(3);
    expect(result.items).toEqual([21, 22, 23, 24, 25]);
  });

  it("reports a single page when there are no items", () => {
    const result = paginate([], 1, 10);

    expect(result.totalPages).toBe(1);
    expect(result.items).toEqual([]);
  });
});

describe("parsePageSize", () => {
  it("accepts a value from the allowed options", () => {
    expect(parsePageSize("30")).toBe(30);
  });

  it("falls back to the default for an unsupported value", () => {
    expect(parsePageSize("7")).toBe(10);
  });

  it("falls back to the default when no value is given", () => {
    expect(parsePageSize(undefined)).toBe(10);
  });
});
