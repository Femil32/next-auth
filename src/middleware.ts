import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";

connect();

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = ["/login", "/signup"].includes(pathname);
  const token = req.cookies.get("token")?.value || "";

  if (isPublic && token) {
    return NextResponse.redirect(new URL("/profile", req.nextUrl.origin));
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/signup"],
};
