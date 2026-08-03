"use server";

import axios from "axios";
import { cookies } from "next/headers";

export interface CreateBookingPayload {
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
}

export const createBookingAction = async (payload: CreateBookingPayload) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to create a booking.",
        data: null,
      };
    }

    // Clean payload: ensure technicianId is NOT included (backend sets it from serviceId)
    const bookingBody = {
      serviceId: payload.serviceId,
      scheduledAt: payload.scheduledAt,
      address: payload.address,
      notes: payload.notes || "Customer appointment",
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.post(`${apiUrl}/api/bookings`, bookingBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Booking created successfully",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error(
      "createBookingAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create booking.",
      data: null,
    };
  }
};

export const createCheckoutSessionAction = async (bookingId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to process payment.",
        data: null,
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.post(
      `${apiUrl}/api/payments/checkout`,
      { bookingId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    // Stripe URL can be in res.data.data.url, res.data.url, res.data.paymentUrl, etc.
    const checkoutUrl =
      res.data?.data?.url ||
      res.data?.data?.paymentUrl ||
      res.data?.data?.checkoutUrl ||
      res.data?.url ||
      res.data?.paymentUrl ||
      res.data?.checkoutUrl;

    return {
      success: true,
      url: checkoutUrl || null,
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error(
      "createCheckoutSessionAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to initiate payment checkout.",
      data: null,
    };
  }
};

export const getMyBookingsAction = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Not authenticated. Please log in.",
        data: [],
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.get(`${apiUrl}/api/bookings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const bookings =
      res.data?.data?.bookings ||
      res.data?.bookings ||
      (Array.isArray(res.data?.data) ? res.data.data : []) ||
      (Array.isArray(res.data) ? res.data : []);

    return {
      success: true,
      data: bookings,
    };
  } catch (error: any) {
    console.error(
      "getMyBookingsAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch bookings.",
      data: [],
    };
  }
};
