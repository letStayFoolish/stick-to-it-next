import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * The payload should contain the minimum, unique user data that'll be used in subsequent requests,
 * such as the user's ID, role, etc.
 * It should not contain personally identifiable information like phone number,
 * email address, credit card information, etc, or sensitive data like passwords.
 *
 */
export async function decrypt(session: string | undefined = "") {
  try {
    if (!session) return;

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    console.log("Verified session", payload);
    return payload;
  } catch (error: any) {
    console.log("Failed to verify session", error);
  }
}

/**
 * To store the session in a cookie, use the Next.js cookies API. The cookie should be set on the server, and include the recommended options:
 *
 * HttpOnly: Prevents client-side JavaScript from accessing the cookie.
 * Secure: Use https to send the cookie.
 * SameSite: Specify whether the cookie can be sent with cross-site requests.
 * Max-Age or Expires: Delete the cookie after a certain period.
 * Path: Define the URL path for the cookie.
 */
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
