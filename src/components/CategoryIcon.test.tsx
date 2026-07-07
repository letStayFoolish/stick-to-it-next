import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { CategoriesType } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";

const allCategories: CategoriesType[] = [
  "bakery",
  "vegetables",
  "fruits",
  "meat",
  "milk-eggs-cheese",
  "water-juice",
  "fish",
  "drinks",
  "chips-snacks",
  "sweets",
  "frozen",
  "pasta-cereals-flour",
  "oil-sauces-spices",
  "tea-coffee-cocoa",
  "cleaning",
  "house-kitchen",
  "canned-food",
  "health-beauty",
  "kids-parents",
  "animals",
];

describe("CategoryIcon", () => {
  it("resolves every CategoriesType member to a distinct, non-fallback icon", () => {
    const renderedSvgs = allCategories.map((category) => {
      const { container } = render(<CategoryIcon category={category} />);
      return container.querySelector("svg")?.getAttribute("class");
    });

    expect(renderedSvgs.every(Boolean)).toBe(true);

    const fallback = render(<CategoryIcon category="unknown-slug" />);
    const fallbackClass = fallback.container
      .querySelector("svg")
      ?.getAttribute("class");

    expect(renderedSvgs).not.toContain(fallbackClass);
    expect(new Set(renderedSvgs).size).toBe(allCategories.length);
  });

  it("falls back to the generic package icon for an unmapped category slug", () => {
    const { container } = render(<CategoryIcon category="not-a-real-category" />);

    expect(container.querySelector("svg.lucide-package")).toBeInTheDocument();
  });
});
