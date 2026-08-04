/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import type { Booking, BookingStatus } from "@/lib/types";

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { accessToken: null, headers: {} };
  }

  return {
    accessToken,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export interface BecomeTechnicianPayload {
  name: string;
  phone: string;
  experienceYrs: number;
  hourlyRate: number;
  address: string;
  city: string;
}

export interface UpdateTechnicianProfilePayload {
  name?: string;
  phone?: string;
  photoUrl?: string;
  experienceYrs?: number;
  hourlyRate?: number;
  address?: string;
  city?: string;
}

export interface TechnicianProfileResponse {
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
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    photoUrl?: string | null;
    role?: string;
  };
}

function extractProfile(raw: any): TechnicianProfileResponse | null {
  if (!raw) return null;

  const profile =
    raw?.profile ||
    raw?.technicianProfile ||
    raw?.technician ||
    (raw?.id && raw?.userId ? raw : null);

  if (!profile) return null;

  const user = profile.user || raw.user || null;

  return {
    ...profile,
    hourlyRate:
      typeof profile.hourlyRate === "string"
        ? parseFloat(profile.hourlyRate)
        : profile.hourlyRate,
    avgRating:
      typeof profile.avgRating === "string"
        ? parseFloat(profile.avgRating)
        : (profile.avgRating ?? 0),
    user: user
      ? {
          ...user,
          photoUrl: user.photoUrl ?? raw.photoUrl ?? null,
        }
      : undefined,
  };
}

function extractBookings(raw: any): Booking[] {
  const list =
    raw?.bookings ||
    raw?.data?.bookings ||
    (Array.isArray(raw?.data) ? raw.data : null) ||
    (Array.isArray(raw) ? raw : []);

  if (!Array.isArray(list)) return [];

  return list.map((booking: any) => ({
    ...booking,
    totalAmount:
      typeof booking.totalAmount === "string"
        ? parseFloat(booking.totalAmount) || 0
        : (booking.totalAmount ?? 0),
    service: booking.service
      ? {
          ...booking.service,
          price:
            typeof booking.service.price === "string"
              ? parseFloat(booking.service.price) || 0
              : booking.service.price,
          categoryName:
            booking.service.category?.name ||
            booking.service.categoryName ||
            undefined,
        }
      : undefined,
  }));
}

export const becomeTechnicianAction = async (
  payload: BecomeTechnicianPayload,
) => {
  try {
    const { accessToken, headers } = await getAuthHeaders();

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to continue.",
        data: null,
      };
    }

    const res = await axios.put(
      `${getApiUrl()}/api/technician/profile`,
      payload,
      {
        headers,
      },
    );

    return {
      success: true,
      message: res.data?.message || "Technician profile created successfully",
      data: extractProfile(res.data?.data || res.data),
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

function buildProfileFromAuthMe(user: any): TechnicianProfileResponse | null {
  const technicianProfile = user?.technicianProfile;
  if (!technicianProfile) return null;

  return extractProfile({
    ...technicianProfile,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photoUrl: user.photoUrl,
      role: user.role,
    },
  });
}

export const getTechnicianProfileAction = async () => {
  try {
    const { accessToken, headers } = await getAuthHeaders();

    if (!accessToken) {
      return {
        success: false,
        error: "Not authenticated. Please log in.",
        data: null,
      };
    }

    // Primary source: /api/auth/me includes nested technicianProfile
    const meRes = await axios.get(`${getApiUrl()}/api/auth/me`, { headers });
    const user =
      meRes.data?.data?.profile ||
      meRes.data?.profile ||
      meRes.data?.data?.user ||
      meRes.data?.user ||
      null;

    const profileFromMe = buildProfileFromAuthMe(user);
    if (profileFromMe) {
      return { success: true, data: profileFromMe };
    }

    // Fallback if backend exposes a dedicated GET route
    try {
      const res = await axios.get(`${getApiUrl()}/api/technician/profile`, {
        headers,
      });
      const profile = extractProfile(res.data?.data || res.data);
      if (profile) {
        return { success: true, data: profile };
      }
    } catch (profileErr: any) {
      if (profileErr?.response?.status !== 404) {
        console.warn(
          "getTechnicianProfileAction fallback error:",
          profileErr?.response?.data || profileErr?.message,
        );
      }
    }

    return {
      success: false,
      error:
        user?.role === "TECHNICIAN"
          ? "Technician profile not found. Please complete your technician registration."
          : "You must be registered as a technician to access this dashboard.",
      data: null,
    };
  } catch (error: any) {
    console.error(
      "getTechnicianProfileAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch technician profile.",
      data: null,
    };
  }
};

export const updateTechnicianProfileAction = async (
  payload: UpdateTechnicianProfilePayload,
) => {
  try {
    const { accessToken, headers } = await getAuthHeaders();

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to continue.",
        data: null,
      };
    }

    const res = await axios.put(
      `${getApiUrl()}/api/technician/profile`,
      payload,
      {
        headers,
      },
    );

    return {
      success: true,
      message: res.data?.message || "Profile updated successfully",
      data: extractProfile(res.data?.data || res.data),
    };
  } catch (error: any) {
    console.error(
      "updateTechnicianProfileAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update technician profile.",
      data: null,
    };
  }
};

export const updateTechnicianAvailabilityAction = async (
  isAvailable: boolean,
) => {
  try {
    const { accessToken, headers } = await getAuthHeaders();

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to continue.",
        data: null,
      };
    }

    const res = await axios.put(
      `${getApiUrl()}/api/technician/availability`,
      { isAvailable },
      { headers },
    );

    return {
      success: true,
      message: res.data?.message || "Availability updated successfully",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error(
      "updateTechnicianAvailabilityAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update availability.",
      data: null,
    };
  }
};

export const getTechnicianBookingsAction = async () => {
  try {
    const { accessToken, headers } = await getAuthHeaders();

    if (!accessToken) {
      return {
        success: false,
        error: "Not authenticated. Please log in.",
        data: [],
      };
    }

    const res = await axios.get(`${getApiUrl()}/api/technician/bookings`, {
      headers,
    });

    return {
      success: true,
      data: extractBookings(res.data?.data || res.data),
    };
  } catch (error: any) {
    console.error(
      "getTechnicianBookingsAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch technician bookings.",
      data: [],
    };
  }
};

export const updateTechnicianBookingStatusAction = async (
  bookingId: string,
  status: BookingStatus,
) => {
  try {
    console.log(bookingId, status);

    const { accessToken, headers } = await getAuthHeaders();

    if (!accessToken) {
      return {
        success: false,
        error: "You are not logged in. Please log in to continue.",
        data: null,
      };
    }

    let res;
    try {
      res = await axios.patch(
        `${getApiUrl()}/api/technician/bookings/${bookingId}`,
        { status },
        { headers },
      );
    } catch (patchErr: any) {
      if (patchErr?.response?.status === 405) {
        res = await axios.put(
          `${getApiUrl()}/api/technician/bookings/${bookingId}`,
          { status },
          { headers },
        );
      } else {
        throw patchErr;
      }
    }

    const booking = res.data?.data?.booking || res.data?.data || res.data;

    return {
      success: true,
      message: res.data?.message || `Booking marked as ${status.toLowerCase()}`,
      data: booking
        ? {
            ...booking,
            totalAmount:
              typeof booking.totalAmount === "string"
                ? parseFloat(booking.totalAmount) || 0
                : booking.totalAmount,
          }
        : null,
    };
  } catch (error: any) {
    console.error(
      "updateTechnicianBookingStatusAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update booking status.",
      data: null,
    };
  }
};
