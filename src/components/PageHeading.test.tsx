import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeading from "@/components/PageHeading";

describe("PageHeading", () => {
  it("renders its children", () => {
    render(<PageHeading>Shopping List</PageHeading>);

    expect(screen.getByText("Shopping List")).toBeInTheDocument();
  });
});
