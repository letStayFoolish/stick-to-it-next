// 1. Specify protected and public routes
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";

// 1. Protected and Public Routes Definition
const protectedRoutes = [/^\/profile$/, /^\/shopping-list$/];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  // Check if the path is a protected or public route
  const isProtectedRoute = protectedRoutes.some((route) => route.test(path));

  // 3. Derive auth state from the single seam
  const auth = await requireUser();

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !auth.authenticated) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("from", path);

    if (req.cookies.has("session")) {
      loginUrl.searchParams.set("reason", "expired");
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 6. Routes Middleware Should Not Run On
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
