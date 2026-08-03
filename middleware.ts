import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/booking", "/myprofile"];

// Auth routes that should NOT be accessible when logged in
const AUTH_ROUTES = ["/login", "/registration"];

// Role → the ONE dashboard path that role is allowed to access
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  TECHNICIAN: "/dashboard/technician",
  CUSTOMER: "/dashboard/customer",
};

// Decode JWT payload (base64url) — no signature verification needed in middleware
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

// Extract role string from JWT access token
function getRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload?.role || payload?.userRole || null;
}

// Check if pathname belongs to a role-specific dashboard sub-route
function isRoleSubDashboard(pathname: string): boolean {
  return Object.values(ROLE_DASHBOARD_MAP).some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isLoggedIn = Boolean(accessToken || refreshToken);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // ── 1. Redirect logged-in users away from auth pages ───────────────────────
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 2. Redirect unauthenticated users away from protected pages ─────────────
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Role-based dashboard protection ────────────────────────────────────
  //    Only runs when user is logged in AND is trying to access a role dashboard
  if (isLoggedIn && isRoleSubDashboard(pathname)) {
    const role = getRoleFromToken(accessToken);

    if (role) {
      const allowedPath = ROLE_DASHBOARD_MAP[role];
      // If the user is NOT on their own dashboard path → redirect to correct one
      if (allowedPath && !pathname.startsWith(allowedPath)) {
        return NextResponse.redirect(new URL(allowedPath, request.url));
      }
    }
    // If no role could be decoded (accessToken missing/expired), fall through to token refresh below
  }

  // ── 4. Auto Token Refresh: accessToken expired but refreshToken present ─────
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

        // Helper to build a response with refreshed tokens set
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

        // If user hit an auth route with a still-valid refresh token → send to their dashboard
        if (isAuthRoute) {
          const redirectPath =
            role && ROLE_DASHBOARD_MAP[role]
              ? ROLE_DASHBOARD_MAP[role]
              : "/dashboard";
          return buildResponseWithTokens(
            NextResponse.redirect(new URL(redirectPath, request.url)),
          );
        }

        // If user is on a wrong-role dashboard after refresh → redirect to correct one
        if (isRoleSubDashboard(pathname) && role) {
          const allowedPath = ROLE_DASHBOARD_MAP[role];
          if (allowedPath && !pathname.startsWith(allowedPath)) {
            return buildResponseWithTokens(
              NextResponse.redirect(new URL(allowedPath, request.url)),
            );
          }
        }

        // Otherwise just proceed and set the new tokens
        return buildResponseWithTokens(NextResponse.next());
      }

      // Refresh failed on a protected route → send to login
      if (isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.log("Middleware token refresh failed:", error);
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
