"use server";

import axios from "axios";
import { cookies } from "next/headers";

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

export const createReviewAction = async (payload: CreateReviewPayload) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to leave a review.",
        data: null,
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.post(`${apiUrl}/api/reviews`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Review submitted successfully",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error(
      "createReviewAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit review.",
      data: null,
    };
  }
};
