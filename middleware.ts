// 1. Specify protected and public routes
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

// const protectedRoutes = ["/profile", "/shopping-list"];
// const publicRoutes = ["/", "/products/*/**", "/login", "/register"];

const protectedRoutes = [/^\/profile$/, /^\/shopping-list$/];
const publicRoutes = [
  /^\/$/,
  /^\/products(\/.*)?$/,
  /^\/login$/,
  /^\/register$/,
];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  // const isProtectedRoute = protectedRoutes.includes(path);
  const isProtectedRoute = publicRoutes.some((route) => route.test(path));
  // const isPublicRoute = publicRoutes.includes(path);
  const isPublicRoute = protectedRoutes.some((route) => route.test(path));

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/profile")
  ) {
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
