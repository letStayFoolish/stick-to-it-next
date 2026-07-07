import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithIntl as render } from "@/test-utils/renderWithIntl";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/actions", () => ({
  signinAction: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

import { redirect, useSearchParams } from "next/navigation";
import { signinAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/app/(auth)/components/LoginForm";

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "a@b.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Password1!" },
  });
  fireEvent.click(screen.getByRole("button", { name: /log in/i }));
}

describe("LoginForm", () => {
  it("shows a session-expired toast when arriving with reason=expired", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("reason=expired&from=/shopping-list") as any,
    );
    const toast = vi.fn();
    vi.mocked(useToast).mockReturnValue({ toast } as any);

    render(<LoginForm />);

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        description: expect.stringMatching(/session expired/i),
      }),
    );
  });

  it("redirects to the preserved path after a successful login", async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("from=/shopping-list") as any,
    );
    vi.mocked(useToast).mockReturnValue({ toast: vi.fn() } as any);
    vi.mocked(signinAction).mockResolvedValue({ success: true } as any);

    render(<LoginForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/shopping-list");
    });
  });

  it("redirects to /profile on a fresh login with no preserved path", async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as any);
    vi.mocked(useToast).mockReturnValue({ toast: vi.fn() } as any);
    vi.mocked(signinAction).mockResolvedValue({ success: true } as any);

    render(<LoginForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/profile");
    });
  });
});
