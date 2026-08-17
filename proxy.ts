/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/booking", "/myprofile"];

const AUTH_ROUTES = ["/login", "/registration"];

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  TECHNICIAN: "/dashboard/technician",
  CUSTOMER: "/dashboard/customer",
};

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload?.role || payload?.userRole || null;
}

function isRoleSubDashboard(pathname: string): boolean {
  return Object.values(ROLE_DASHBOARD_MAP).some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  const exp = payload.exp;
  if (typeof exp === "number") {
    return exp > Math.floor(Date.now() / 1000);
  }
  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isLoggedIn = Boolean(accessToken || refreshToken);
  const hasValidAccessToken = isTokenValid(accessToken);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthRoute && hasValidAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isRoleSubDashboard(pathname)) {
    const role = getRoleFromToken(accessToken);

    if (role) {
      const allowedPath = ROLE_DASHBOARD_MAP[role];
      if (allowedPath && !pathname.startsWith(allowedPath)) {
        return NextResponse.redirect(new URL(allowedPath, request.url));
      }
    }
  }

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
        const role = getRoleFromToken(newAccessToken);

        const buildResponseWithTokens = (response: NextResponse) => {
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
        };

        if (isAuthRoute) {
          const redirectPath =
            role && ROLE_DASHBOARD_MAP[role]
              ? ROLE_DASHBOARD_MAP[role]
              : "/dashboard";
          return buildResponseWithTokens(
            NextResponse.redirect(new URL(redirectPath, request.url)),
          );
        }

        if (isRoleSubDashboard(pathname) && role) {
          const allowedPath = ROLE_DASHBOARD_MAP[role];
          if (allowedPath && !pathname.startsWith(allowedPath)) {
            return buildResponseWithTokens(
              NextResponse.redirect(new URL(allowedPath, request.url)),
            );
          }
        }

        return buildResponseWithTokens(NextResponse.next());
      }

      if (isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.log("Proxy token refresh failed:", error);
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
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
