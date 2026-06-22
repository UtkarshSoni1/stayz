import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/listings"];
const publicPrefixes = ["/api/auth", "/listings/"];

export async function proxy(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  const path = request.nextUrl.pathname;

  // Allow public API auth routes (next-auth internals)
  if (publicPrefixes.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow exact public routes
  if (publicRoutes.includes(path)) {
    // If already logged in and trying to access login/signup, redirect to dashboard
    if (isLoggedIn && (path === "/login" || path === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
