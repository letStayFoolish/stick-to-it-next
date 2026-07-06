// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";
import { encrypt, requireUser } from "@/lib/session";

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
