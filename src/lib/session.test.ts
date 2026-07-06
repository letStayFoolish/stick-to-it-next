// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";
import { createSession, encrypt, requireUser, updateSession } from "@/lib/session";

async function signExpiredToken(payload: Record<string, unknown>) {
  const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("-1s")
    .sign(encodedKey);
}

function mockSessionCookie(value: string | undefined) {
  vi.mocked(cookies).mockResolvedValue({
    get: () => (value === undefined ? undefined : { value }),
  } as any);
}

describe("requireUser", () => {
  it("returns not-authenticated when there is no session cookie", async () => {
    mockSessionCookie(undefined);

    const result = await requireUser();

    expect(result).toEqual({ authenticated: false });
  });

  it("returns the authenticated user for a valid session cookie", async () => {
    const token = await encrypt({ userId: "user-123" });
    mockSessionCookie(token);

    const result = await requireUser();

    expect(result).toEqual({ authenticated: true, userId: "user-123" });
  });

  it("returns not-authenticated when the session cookie has expired", async () => {
    const token = await signExpiredToken({ userId: "user-123" });
    mockSessionCookie(token);

    const result = await requireUser();

    expect(result).toEqual({ authenticated: false });
  });
});

describe("session cookie security flag", () => {
  it("createSession does not mark the cookie Secure outside production, so it survives on http://localhost in dev", async () => {
    const set = vi.fn();
    vi.mocked(cookies).mockResolvedValue({ set } as any);

    await createSession("user-123");

    expect(set).toHaveBeenCalledWith(
      "session",
      expect.any(String),
      expect.objectContaining({ secure: false }),
    );
  });

  it("updateSession does not mark the cookie Secure outside production", async () => {
    const token = await encrypt({ userId: "user-123" });
    const set = vi.fn();
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ value: token }),
      set,
    } as any);

    await updateSession();

    expect(set).toHaveBeenCalledWith(
      "session",
      token,
      expect.objectContaining({ secure: false }),
    );
  });
});
