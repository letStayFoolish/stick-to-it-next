import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithIntl as render } from "@/test-utils/renderWithIntl";

vi.mock("@/lib/actions/clearProducts", () => ({
  clearProducts: vi.fn(),
}));

import { clearProducts } from "@/lib/actions/clearProducts";
import ClearAllBtn from "@/app/(private)/shopping-list/components/ClearAllBtn";

describe("ClearAllBtn", () => {
  it("does not clear the list immediately on click, asking for confirmation first", () => {
    render(<ClearAllBtn />);

    fireEvent.click(screen.getByRole("button", { name: "Clear List" }));

    expect(screen.getByText("Clear shopping list?")).toBeInTheDocument();
    expect(clearProducts).not.toHaveBeenCalled();
  });

  it("closes the confirmation without clearing when cancelled", () => {
    render(<ClearAllBtn />);

    fireEvent.click(screen.getByRole("button", { name: "Clear List" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByText("Clear shopping list?")).not.toBeInTheDocument();
    expect(clearProducts).not.toHaveBeenCalled();
  });

  it("submits the clear action once the destructive action is confirmed", async () => {
    vi.mocked(clearProducts).mockResolvedValue({
      success: true,
      message: "",
    });

    render(<ClearAllBtn />);

    fireEvent.click(screen.getByRole("button", { name: "Clear List" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Clear List", hidden: false }),
    );

    await waitFor(() => expect(clearProducts).toHaveBeenCalled());
  });
});
