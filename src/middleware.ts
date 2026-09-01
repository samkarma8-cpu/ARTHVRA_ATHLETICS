import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME, ADMIN_ROLE } from "./lib/constants";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "changeme-in-production-arthvra-athletics-secret-2026"
);

async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; email: string; name: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSessionFromRequest(req);

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== ADMIN_ROLE) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  // Protect customer account routes
  if (
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/wishlist")
  ) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // If already logged in and visiting auth pages, redirect to account
  if (
    session &&
    (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password")
  ) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
