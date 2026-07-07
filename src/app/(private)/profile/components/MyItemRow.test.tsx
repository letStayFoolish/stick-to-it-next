import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { Table, TableBody } from "@/components/ui/table";
import type { ProductPlain } from "@/lib/types";

vi.mock("@/lib/actions/myItems", () => ({
  updateOwnedItem: vi.fn(),
  deleteOwnedItem: vi.fn(),
}));

import {
  updateOwnedItem,
  deleteOwnedItem,
} from "@/lib/actions/myItems";
import MyItemRow from "@/app/(private)/profile/components/MyItemRow";

const product: ProductPlain = {
  _id: "product-1",
  product_name: "Batteries",
  category: "house-kitchen",
  isLiked: false,
};

function renderRow() {
  return renderWithIntl(
    <Table>
      <TableBody>
        <MyItemRow product={product} />
      </TableBody>
    </Table>,
  );
}

describe("MyItemRow", () => {
  it("opens the edit dialog with the item's current name and category chip selected", () => {
    renderRow();

    fireEvent.click(screen.getByRole("button", { name: /edit batteries/i }));

    expect(screen.getByLabelText(/item name/i)).toHaveValue("Batteries");
    expect(
      screen.getByRole("button", { name: /house.*kitchen/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows a non-silent error when the update action fails", async () => {
    vi.mocked(updateOwnedItem).mockResolvedValue({
      success: false,
      message: "Unknown category",
    });

    renderRow();
    fireEvent.click(screen.getByRole("button", { name: /edit batteries/i }));
    fireEvent.submit(screen.getByLabelText(/item name/i).closest("form")!);

    expect(await screen.findByText("Unknown category")).toBeInTheDocument();
  });

  it("submits a delete request for this item's id", async () => {
    vi.mocked(deleteOwnedItem).mockResolvedValue({ success: true });

    renderRow();
    fireEvent.click(screen.getByRole("button", { name: /delete batteries/i }));

    await vi.waitFor(() => expect(deleteOwnedItem).toHaveBeenCalled());
    const [, formData] = vi.mocked(deleteOwnedItem).mock.calls[0];
    expect((formData as FormData).get("product_id")).toBe("product-1");
  });
});
