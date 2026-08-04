"use server";

import { jwtUtils } from "@/lib/jwt";
import { cookies } from "next/headers";
// Adjust import path to your jwt utility file

export interface UserData {
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}

export async function getCurrentUser(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  // Use your verifyAndRefreshToken utility
  const result = jwtUtils.verifyAndRefreshToken(accessToken, refreshToken);

  if (!result.success || !result.data) {
    return null;
  }

  const tokenData = result.data as Record<string, any>;

  // Extract nested user object if payload structured as { data: { ... } }, otherwise fallback to root properties
  const userObj = tokenData.data || tokenData.user || tokenData;

  return {
    name: userObj.name || userObj.userName || "User",
    email: userObj.email || "",
    role: userObj.role || "CUSTOMER",
    photoUrl: userObj.photoUrl || userObj.avatar || userObj.image || "",
  };
}
