// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { SignJWT } from "jose";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";
import middleware from "@/middleware";

function mockSessionCookie(value: string | undefined) {
  vi.mocked(cookies).mockResolvedValue({
    get: () => (value === undefined ? undefined : { value }),
  } as any);
}

async function signExpiredToken(payload: Record<string, unknown>) {
  const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("-1s")
    .sign(encodedKey);
}

function requestTo(path: string, cookieHeader?: string) {
  return new NextRequest(new URL(path, "http://localhost"), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
}

describe("middleware", () => {
  it("redirects to /login with the original path when there is no session at all", async () => {
    mockSessionCookie(undefined);

    const response = await middleware(requestTo("/shopping-list"));

    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("from")).toBe("/shopping-list");
    expect(location.searchParams.get("reason")).toBeNull();
  });

  it("redirects with reason=expired when a session cookie was present but is no longer valid", async () => {
    const expiredToken = await signExpiredToken({ userId: "user-123" });
    mockSessionCookie(expiredToken);

    const response = await middleware(
      requestTo("/shopping-list", `session=${expiredToken}`),
    );

    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("from")).toBe("/shopping-list");
    expect(location.searchParams.get("reason")).toBe("expired");
  });
});
