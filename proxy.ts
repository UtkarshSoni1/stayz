import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that any visitor can access without authentication
const PUBLIC_PATHS = ["/", "/listings", "/login", "/signup", "/forgot-password"];

// Path prefixes that are always public
const PUBLIC_PREFIXES = ["/listings/", "/api/", "/_next/", "/favicon", "/auth/"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getDashboardForRole(role: string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "OWNER":
      return "/owner/dashboard";
    default:
      return "/user/dashboard";
  }
}

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAuthenticated = !!session?.user?.id;

  // ── 1. Public assets / routes ──────────────────────────────────────────────
  if (isPublicPath(pathname)) {
    // If authenticated user tries to visit login/signup, redirect to their dashboard
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(role), request.url)
      );
    }
    return NextResponse.next();
  }

  // ── 2. Unauthenticated — redirect to login ─────────────────────────────────
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Role-based access control ──────────────────────────────────────────

  // /admin/* — ADMIN only
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(getDashboardForRole(role), request.url)
      );
    }
    return NextResponse.next();
  }

  // /owner/* — OWNER or ADMIN
  if (pathname.startsWith("/owner")) {
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // /user/* — any authenticated user
  if (pathname.startsWith("/user")) {
    return NextResponse.next();
  }

  // ── 4. Any other authenticated route — allow ───────────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
