import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/record" || pathname.startsWith("/record/") || pathname.startsWith("/api/record/")) {
    return new NextResponse("Not found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/record", "/record/:path*", "/api/record/:path*"],
};
