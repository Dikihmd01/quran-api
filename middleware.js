import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();

  if (url.pathname === "/") {
    url.pathname = "/api";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only apply middleware to specific paths
export const config = {
  matcher: ["/"],
};
