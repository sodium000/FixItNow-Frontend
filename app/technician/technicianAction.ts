"use server";

import axios from "axios";
import { cookies } from "next/headers";

export interface BecomeTechnicianPayload {
  name: string;
  phone: string;
  experienceYrs: number;
  hourlyRate: number;
  address: string;
  city: string;
}

export const becomeTechnicianAction = async (
  payload: BecomeTechnicianPayload,
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to continue.",
        data: null,
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.put(`${apiUrl}/api/technician/profile`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Technician profile created successfully",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error(
      "becomeTechnicianAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create technician profile.",
      data: null,
    };
  }
};
