// 1. Specify protected and public routes
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

// const protectedRoutes = ["/profile", "/shopping-list"];
// const publicRoutes = ["/", "/products/*/**", "/login", "/register"];

// 1. Protected and Public Routes Definition
const protectedRoutes = [/^\/profile$/, /^\/shopping-list$/];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicRoutes = [
  /^\/$/,
  /^\/products(\/.*)?$/,
  /^\/login$/,
  /^\/register$/,
];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  // Check if the path is a protected or public route
  const isProtectedRoute = protectedRoutes.some((route) => route.test(path));

  // const isProtectedRoute = protectedRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value || "No cookie";
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

// 6. Routes Middleware Should Not Run On
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
