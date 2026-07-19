import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test-utils/renderWithIntl";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/products/vegetables",
  useSearchParams: () => new URLSearchParams("page=2"),
}));

import PageSizeSelect from "@/components/PageSizeSelect";

describe("PageSizeSelect", () => {
  it("shows the current page size as selected", () => {
    render(<PageSizeSelect pageSize={30} />);

    expect(screen.getByRole("combobox")).toHaveValue("30");
  });

  it("navigates to the chosen page size and resets to page 1", () => {
    render(<PageSizeSelect pageSize={10} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "50" },
    });

    expect(push).toHaveBeenCalledWith(
      "/products/vegetables?page=1&pageSize=50",
    );
  });
});
