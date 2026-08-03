"use server";

import axios from "axios";
import { cookies } from "next/headers";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  isActive: boolean;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  technicianProfile?: {
    id: string;
    userId: string;
    experienceYrs: number;
    hourlyRate: number;
    isVerified: boolean;
    isAvailable: boolean;
    address?: string;
    city?: string;
    avgRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export const getMyProfileAction = async (): Promise<{
  success: boolean;
  data: UserProfile | null;
  error?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, data: null, error: "Not authenticated. Please log in." };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.get(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const profile: UserProfile =
      res.data?.data?.profile || res.data?.profile || null;

    return { success: true, data: profile };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch profile.";
    return { success: false, data: null, error: message };
  }
};
