import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/myprofile", "/dashboard", "/booking"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Protected Route Guard: if no tokens at all → redirect to /login
  // ──────────────────────────────────────────────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Auto Token Refresh: accessToken missing but refreshToken present
  // ──────────────────────────────────────────────────────────────────────────
  if (!accessToken && refreshToken) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const apiRes = await fetch(`${apiUrl}/api/authlogin/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const resData = await apiRes.json();
      const newAccessToken = resData?.data?.accessToken || resData?.accessToken;
      const newRefreshToken =
        resData?.data?.refreshToken || resData?.refreshToken;

      if (newAccessToken) {
        const response = NextResponse.next();

        response.cookies.set({
          name: "accessToken",
          value: newAccessToken,
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          sameSite: "lax",
          path: "/",
        });

        if (newRefreshToken) {
          response.cookies.set({
            name: "refreshToken",
            value: newRefreshToken,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            path: "/",
          });
        }

        return response;
      }

      // Refresh failed on a protected route → redirect to login
      if (isProtected) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.log("Middleware backend token refresh failed:", error);
      if (isProtected) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
