import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithIntl as render } from "@/test-utils/renderWithIntl";

vi.mock("@/lib/actions/quickAddItem", () => ({
  quickAddItem: vi.fn(),
}));

import { quickAddItem } from "@/lib/actions/quickAddItem";
import QuickAddItem from "@/app/(private)/shopping-list/components/QuickAddItem";

describe("QuickAddItem", () => {
  it("defaults the category chip row to 'else'", () => {
    render(<QuickAddItem />);

    expect(screen.getByRole("button", { name: /else/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("selecting a different category chip updates the selection", () => {
    render(<QuickAddItem />);

    fireEvent.click(screen.getByRole("button", { name: /bakery/i }));

    expect(screen.getByRole("button", { name: /bakery/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /else/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows a non-silent validation error returned by the action", async () => {
    vi.mocked(quickAddItem).mockResolvedValue({
      success: false,
      message: "Name is required",
    });

    render(<QuickAddItem />);

    fireEvent.submit(screen.getByRole("button", { name: /add/i }).closest("form")!);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("clears the input after a successful add", async () => {
    vi.mocked(quickAddItem).mockResolvedValue({ success: true });

    render(<QuickAddItem />);

    const input = screen.getByLabelText(/item name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Batteries" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => expect(input.value).toBe(""));
  });
});
