import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithIntl as render } from "@/test-utils/renderWithIntl";

vi.mock("@/lib/actions/updateNotes", () => ({
  updateNotes: vi.fn(),
}));

import { updateNotes } from "@/lib/actions/updateNotes";
import TripMemo from "@/app/(private)/shopping-list/components/TripMemo";

describe("TripMemo", () => {
  it("shows an inviting empty-state affordance when there is no memo", () => {
    render(<TripMemo initialNotes="" />);

    expect(
      screen.getByText(/add a note for this trip/i),
    ).toBeInTheDocument();
  });

  it("shows the existing memo text when not editing", () => {
    render(<TripMemo initialNotes="budget 50€" />);

    expect(screen.getByText("budget 50€")).toBeInTheDocument();
  });

  it("enters edit mode on tap, showing a textarea seeded with the current memo", () => {
    render(<TripMemo initialNotes="budget 50€" />);

    fireEvent.click(screen.getByText("budget 50€"));

    expect(screen.getByRole("textbox")).toHaveValue("budget 50€");
  });

  it("exits edit mode after a successful save", async () => {
    vi.mocked(updateNotes).mockResolvedValue({ success: true });

    render(<TripMemo initialNotes="" />);
    fireEvent.click(screen.getByText(/add a note for this trip/i));

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "return bottles" } });
    fireEvent.submit(textarea.closest("form")!);

    await waitFor(() =>
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("return bottles")).toBeInTheDocument();
  });

  it("keeps the draft visible and surfaces a non-silent error when save fails", async () => {
    vi.mocked(updateNotes).mockResolvedValue({
      success: false,
      message: "Failed to save your note. Please try again.",
    });

    render(<TripMemo initialNotes="" />);
    fireEvent.click(screen.getByText(/add a note for this trip/i));

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "return bottles" } });
    fireEvent.submit(textarea.closest("form")!);

    expect(
      await screen.findByText("Failed to save your note. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("return bottles");
  });
});
