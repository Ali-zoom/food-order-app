import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { UserRole } from "./app/generated/prisma/enums";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAdmin = token?.role === UserRole.ADMIN;

  const authRoutes = ["/login", "/register"];
  const protectedRoutes = ["/admin", "/profile","/orders"];

  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));

  // 🔐 Not logged in → block protected
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔁 Logged in → redirect away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/profile", req.url),
    );
  }

  // 🔁 Logged in → prevent wrong role access
  if (isProtectedRoute && token) {
    if (isAdmin && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (!isAdmin && !pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/profile", "/admin", "/register"], // protect all dashboard routes
  //   matcher: ["/dashboard/:path*"], // protect all dashboard routes
};
