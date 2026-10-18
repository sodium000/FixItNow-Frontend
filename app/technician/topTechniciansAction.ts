"use server";

import axios from "axios";
import { getErrorMessage } from "@/lib/utils";

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface PublicTechnicianUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
  role?: string;
}

export interface PublicTechnician {
  id: string;
  userId: string;
  name?: string;
  experienceYrs: number;
  hourlyRate: number | string;
  isVerified: boolean;
  isAvailable: boolean;
  address?: string | null;
  city?: string | null;
  avgRating: number | string;
  totalReviews: number;
  createdAt?: string;
  updatedAt?: string;
  user?: PublicTechnicianUser;
  // category / specialty may come via services relation
  services?: Array<{ category?: { name: string } }>;
}

function normaliseItem(
  raw: any,
  serviceMap?: Map<string, string[]>,
): PublicTechnician {
  if (!raw) {
    return {
      id: "unknown",
      userId: "unknown",
      name: "Technician",
      experienceYrs: 0,
      hourlyRate: 0,
      isVerified: false,
      isAvailable: true,
      avgRating: 0,
      totalReviews: 0,
      user: {
        id: "unknown",
        name: "Technician",
        email: "",
      },
    };
  }

  // Handle case where raw is User with nested technicianProfile
  const hasProfile = Boolean(
    raw.technicianProfile && typeof raw.technicianProfile === "object",
  );
  const profile = hasProfile ? raw.technicianProfile : raw;
  const user = hasProfile ? raw : raw.user;

  const id = String(profile?.id || raw.id || "");
  const userId = String(profile?.userId || user?.id || raw.userId || id);

  const name = user?.name || raw.name || "Technician";
  const email = user?.email || raw.email || "";
  const phone = user?.phone || raw.phone || null;
  const photoUrl = user?.photoUrl || raw.photoUrl || null;
  const role = user?.role || raw.role || "TECHNICIAN";

  const experienceYrs =
    typeof profile?.experienceYrs === "number"
      ? profile.experienceYrs
      : parseInt(
          String(profile?.experienceYrs || raw.experienceYrs || 0),
          10,
        ) || 0;

  const hourlyRate =
    typeof profile?.hourlyRate === "number"
      ? profile.hourlyRate
      : parseFloat(String(profile?.hourlyRate || raw.hourlyRate || 0)) || 0;

  const avgRating =
    typeof profile?.avgRating === "number"
      ? profile.avgRating
      : parseFloat(String(profile?.avgRating || raw.avgRating || 0)) || 0;

  const totalReviews =
    typeof profile?.totalReviews === "number"
      ? profile.totalReviews
      : parseInt(String(profile?.totalReviews || raw.totalReviews || 0), 10) ||
        0;

  const isVerified = Boolean(
    profile?.isVerified !== undefined ? profile.isVerified : raw.isVerified,
  );
  const isAvailable = Boolean(
    profile?.isAvailable !== undefined
      ? profile.isAvailable
      : raw.isAvailable !== undefined
        ? raw.isAvailable
        : true,
  );

  const address = profile?.address || raw.address || null;
  const city = profile?.city || raw.city || null;

  // Resolve specialty services
  let services = raw.services || profile?.services;
  if (!services || services.length === 0) {
    const cats = serviceMap?.get(id) || serviceMap?.get(userId);
    if (cats && cats.length > 0) {
      services = cats.map((catName) => ({ category: { name: catName } }));
    }
  }

  return {
    id,
    userId,
    name,
    experienceYrs,
    hourlyRate,
    isVerified,
    isAvailable,
    address,
    city,
    avgRating,
    totalReviews,
    createdAt: profile?.createdAt || raw.createdAt,
    updatedAt: profile?.updatedAt || raw.updatedAt,
    user: {
      id: userId,
      name,
      email,
      phone,
      photoUrl,
      role,
    },
    services,
  };
}

/**
 * Fetches the public list of technicians ordered by rating.
 * No authentication required — used on the public landing page.
 */
export const getTopTechniciansAction = async (
  limit = 4,
): Promise<{
  success: boolean;
  data: PublicTechnician[];
  error?: string;
}> => {
  try {
    const apiUrl = getApiUrl();

    // Endpoints to query
    const endpoints = [
      `${apiUrl}/api/technicians`,
      `${apiUrl}/api/technicians?limit=${limit}&sort=rating`,
      `${apiUrl}/api/technicians?limit=${limit}`,
      `${apiUrl}/api/technician`,
      `${apiUrl}/api/users/technicians`,
    ];

    let list: any[] = [];

    // Query technician list
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { timeout: 6000 });
        const raw =
          res.data?.data?.users ||
          res.data?.data?.technicians ||
          res.data?.users ||
          res.data?.technicians ||
          (Array.isArray(res.data?.data) ? res.data.data : null) ||
          (Array.isArray(res.data) ? res.data : null);

        if (Array.isArray(raw) && raw.length > 0) {
          list = raw;
          break;
        }
      } catch {
        // silently try next endpoint
      }
    }

    // Try fetching services to map categories/specialties for each technician
    const serviceMap = new Map<string, string[]>();
    try {
      const servRes = await axios.get(`${apiUrl}/api/services`, {
        timeout: 4000,
      });
      const servList =
        servRes.data?.data?.services ||
        servRes.data?.services ||
        (Array.isArray(servRes.data?.data) ? servRes.data.data : null) ||
        (Array.isArray(servRes.data) ? servRes.data : null);

      if (Array.isArray(servList)) {
        for (const s of servList) {
          const catName = s.category?.name || s.categoryName;
          if (catName) {
            const tId = s.technicianId || s.technician?.id;
            const uId = s.technician?.userId;
            if (tId) {
              if (!serviceMap.has(tId)) serviceMap.set(tId, []);
              serviceMap.get(tId)!.push(catName);
            }
            if (uId) {
              if (!serviceMap.has(uId)) serviceMap.set(uId, []);
              serviceMap.get(uId)!.push(catName);
            }
          }
        }
      }
    } catch {
      // Optional enhancement; ignore if services fetch fails
    }

    // Sort by avgRating descending, then total reviews, then verified, then experience
    const sorted = list
      .map((item) => normaliseItem(item, serviceMap))
      .sort((a, b) => {
        const ratingDiff = Number(b.avgRating) - Number(a.avgRating);
        if (Math.abs(ratingDiff) > 0.001) return ratingDiff;
        const reviewsDiff = (b.totalReviews || 0) - (a.totalReviews || 0);
        if (reviewsDiff !== 0) return reviewsDiff;
        if (b.isVerified !== a.isVerified) return b.isVerified ? -1 : 1;
        return (b.experienceYrs || 0) - (a.experienceYrs || 0);
      })
      .slice(0, limit);

    return { success: true, data: sorted };
  } catch (error: unknown) {
    console.error("getTopTechniciansAction error:", error);
    return {
      success: false,
      data: [],
      error: getErrorMessage(error, "Failed to fetch technicians"),
    };
  }
};
