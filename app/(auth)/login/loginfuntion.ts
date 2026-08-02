"use server";

import { axiosInstance } from "@/lib/axios";
import { LoginUserType } from "./LoginCard";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { jwtUtils } from "@/lib/jwt";

export const loginUser = async (data: LoginUserType) => {
  try {
    const res = await axiosInstance.post("/api/authlogin/login", data);
    console.log("Login API response:", res.data);

    const accessToken =
      res.data?.data?.accessToken || res.data?.accessToken;
    const refreshToken =
      res.data?.data?.refreshToken || res.data?.refreshToken;

    if (accessToken && refreshToken) {
      const cookieStore = await cookies();

      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    let decodedToken: JwtPayload | null = null;
    if (accessToken) {
      decodedToken = jwt.decode(accessToken) as JwtPayload;
    }

    return { success: true, data: decodedToken, accessToken, refreshToken };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message;
    return { success: false, error: message };
  }
};

export const refreshAccessToken = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return { success: false, error: "No refresh token found." };
    }

    // Call backend refresh API
    const res = await axiosInstance.post(
      "/api/authlogin/refresh-token",
      { refreshToken },
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const newAccessToken =
      res.data?.data?.accessToken || res.data?.accessToken;
    const newRefreshToken =
      res.data?.data?.refreshToken || res.data?.refreshToken;

    if (newAccessToken) {
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      if (newRefreshToken) {
        cookieStore.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          sameSite: "lax",
        });
      }

      const decodedToken = jwt.decode(newAccessToken) as JwtPayload;
      return {
        success: true,
        accessToken: newAccessToken,
        data: decodedToken,
      };
    }

    return { success: false, error: "Failed to obtain new access token from API." };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to refresh token.";
    return { success: false, error: message };
  }
};

export const getValidAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken) {
    try {
      const decoded = jwt.decode(accessToken) as JwtPayload;
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        return { success: true, accessToken, data: decoded };
      }
    } catch {
      // Access token invalid/expired, proceed to refresh
    }
  }

  return await refreshAccessToken();
};


