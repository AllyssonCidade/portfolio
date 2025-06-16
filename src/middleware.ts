import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "admin-auth-token";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginUrl = new URL("/admin/login", request.url);
  const adminDashboardUrl = new URL("/admin", request.url);

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token && JWT_SECRET) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      isAuthenticated = true;
    } catch (error) {
      console.warn("JWT verification failed:", error);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(AUTH_COOKIE_NAME, "", { maxAge: -1, path: "/" });
      return response;
    }
  }

  if (pathname === "/admin/login") {
    if (isAuthenticated) return NextResponse.redirect(adminDashboardUrl);
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
