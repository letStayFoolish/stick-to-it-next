import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ProductPlain } from "@/lib/types";

vi.mock("@/lib/session", () => ({
  requireUser: vi.fn(),
}));

vi.mock("@/lib/actions/fetchShoppingListItems", () => ({
  fetchShoppingListItems: vi.fn(),
}));

import { requireUser } from "@/lib/session";
import { fetchShoppingListItems } from "@/lib/actions/fetchShoppingListItems";
import ProductItem from "@/components/Product/ProductItem";

const product: ProductPlain = {
  _id: "product-1",
  product_name: "Apple",
  category: "fruit",
  isLiked: false,
};

describe("ProductItem", () => {
  it("does not render an interactive like button for an unauthenticated request", async () => {
    vi.mocked(requireUser).mockResolvedValue({ authenticated: false });
    vi.mocked(fetchShoppingListItems).mockResolvedValue(undefined);

    const jsx = await ProductItem({ product });
    render(jsx);

    expect(
      screen.queryByRole("button", { name: /favorites/i }),
    ).not.toBeInTheDocument();
  });
});
