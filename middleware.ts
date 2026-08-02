import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const response = NextResponse.next();

  // If accessToken is missing but refreshToken is present, call backend API to refresh
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
      }
    } catch (error) {
      console.log("Middleware backend token refresh failed:", error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
