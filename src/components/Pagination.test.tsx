import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination basePath="/products/bakery" currentPage={1} totalPages={1} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("links each page number to ?page=N under the base path", () => {
    render(
      <Pagination basePath="/products/vegetables" currentPage={2} totalPages={4} />,
    );

    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/products/vegetables?page=1",
    );
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/products/vegetables?page=3",
    );
  });

  it("marks the current page and does not render it as a link", () => {
    render(
      <Pagination basePath="/products/vegetables" currentPage={2} totalPages={4} />,
    );

    const current = screen.getByText("2");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.closest("a")).toBeNull();
  });

  it("includes pageSize in each link when provided", () => {
    render(
      <Pagination
        basePath="/products/vegetables"
        currentPage={2}
        totalPages={4}
        pageSize={30}
      />,
    );

    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/products/vegetables?page=1&pageSize=30",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/products/vegetables?page=3&pageSize=30",
    );
  });

  it("hides Previous on the first page and Next on the last page", () => {
    const { rerender } = render(
      <Pagination basePath="/products/vegetables" currentPage={1} totalPages={4} />,
    );
    expect(screen.queryByRole("link", { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/products/vegetables?page=2",
    );

    rerender(
      <Pagination basePath="/products/vegetables" currentPage={4} totalPages={4} />,
    );
    expect(screen.queryByRole("link", { name: /next/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
      "href",
      "/products/vegetables?page=3",
    );
  });
});
