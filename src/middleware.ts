import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = [
    "/auth/login",
    "/auth/signup",
    "/auth/verify-email",
    "/auth/reset-password",
  ].includes(pathname);
  const token = req.cookies.get("token")?.value || "";

  if (isPublic && token) {
    return NextResponse.redirect(new URL("/user/profile", req.nextUrl.origin));
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
  }
}

export const config = {
  matcher: [
    "/",
    "/user/profile/:path*",
    "/auth/login",
    "/auth/login/signup",
    "/auth/login/verify-email",
    "/auth/reset-password",
  ],
};
