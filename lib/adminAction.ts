"use server";

import axios from "axios";
import { cookies } from "next/headers";
import type { ServiceCategory, User, Booking } from "@/lib/types";

export interface CreateCategoryServiceInput {
  name: string;
  price: number;
  technicianId: string;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  services: CreateCategoryServiceInput[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 1. Create Service Category (Only Admin)
export const createAdminCategoryAction = async (
  payload: CreateCategoryPayload,
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Unauthorized. Admin login required.",
        data: null,
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.post(`${apiUrl}/api/admin/categories`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Category created successfully by Admin",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error(
      "createAdminCategoryAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create category. Ensure you have Admin privileges.",
      data: null,
    };
  }
};

export const getAllTechnicians = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await axios.get(`${apiUrl}/api/technicians`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

// 2. Get All Categories with Pagination
export const getAdminCategoriesAction = async (page = 1, limit = 10) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const res = await axios.get(`${apiUrl}/api/services`, {
      params: { page, limit },
      headers,
    });

    const raw = res.data?.data || res.data;

    const meta: PaginationMeta = raw?.meta ||
      raw?.pagination ||
      res.data?.meta ||
      res.data?.pagination || {
        page,
        limit,
        total: raw.length,
        totalPages: Math.ceil(raw.length / limit) || 1,
      };

    return {
      success: true,
      data: raw,
      meta,
    };
  } catch (error: any) {
    console.error(
      "getAdminCategoriesAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch admin categories.",
      data: [],
      meta: { page: 1, limit, total: 0, totalPages: 1 },
    };
  }
};

// 3. Get All Users (Admin)
export const getAdminUsersAction = async (page = 1, limit = 10) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Unauthorized. Admin login required.",
        data: [],
        meta: { page: 1, limit, total: 0, totalPages: 1 },
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.get(`${apiUrl}/api/admin/users`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const raw = res.data?.data || res.data;

    const meta: PaginationMeta = raw?.meta ||
      raw?.pagination ||
      res.data?.meta ||
      res.data?.pagination || {
        page,
        limit,
        total: raw.length,
        totalPages: Math.ceil(raw.length / limit) || 1,
      };

    return {
      success: true,
      data: raw,
      meta,
    };
  } catch (error: any) {
    console.error(
      "getAdminUsersAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch users.",
      data: [],
      meta: { page: 1, limit, total: 0, totalPages: 1 },
    };
  }
};

// 4. Update Individual User Status (PATCH /api/admin/users/:userId)
export const updateAdminUserStatusAction = async (
  userId: string,
  updateData: {
    isActive?: boolean;
    role?: string;
    isBlocked?: boolean;
    status?: string;
  },
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Unauthorized. Admin login required.",
        data: null,
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    let res;
    try {
      res = await axios.patch(
        `${apiUrl}/api/admin/users/${userId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (patchErr: any) {
      // Fallback to PUT if PATCH endpoint is not configured
      if (patchErr?.response?.status === 405) {
        res = await axios.put(
          `${apiUrl}/api/admin/users/${userId}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } else {
        throw patchErr;
      }
    }

    return {
      success: true,
      message: res.data?.message || "User status updated successfully.",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error(
      "updateAdminUserStatusAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update user status.",
      data: null,
    };
  }
};

// 5. Get All Admin Bookings
export const getAdminBookingsAction = async (page = 1, limit = 10) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Unauthorized. Admin login required.",
        data: [],
        meta: { page: 1, limit, total: 0, totalPages: 1 },
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.get(`${apiUrl}/api/admin/bookings`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const raw = res.data?.data || res.data;

    const meta: PaginationMeta = raw?.meta ||
      raw?.pagination ||
      res.data?.meta ||
      res.data?.pagination || {
        page,
        limit,
        total: raw.length,
        totalPages: Math.ceil(raw.length / limit) || 1,
      };

    return {
      success: true,
      data: raw,
      meta,
    };
  } catch (error: any) {
    console.error(
      "getAdminBookingsAction error:",
      error?.response?.data || error?.message,
    );
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch admin bookings.",
      data: [],
      meta: { page: 1, limit, total: 0, totalPages: 1 },
    };
  }
};

// 6. Delete a User (Admin)
export const deleteAdminUserAction = async (userId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return { success: false, error: "Unauthorized." };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.delete(`${apiUrl}/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      message: res.data?.message || "User deleted successfully.",
    };
  } catch (error: any) {
    console.error("deleteAdminUserAction error:", error?.response?.data || error?.message);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete user.",
    };
  }
};

// 7. Update a User Info (Admin)
export const updateAdminUserAction = async (
  userId: string,
  payload: { name?: string; email?: string; phone?: string; role?: string },
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return { success: false, error: "Unauthorized.", data: null };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.patch(`${apiUrl}/api/admin/users/${userId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: res.data?.message || "User updated successfully.",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error("updateAdminUserAction error:", error?.response?.data || error?.message);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update user.",
      data: null,
    };
  }
};

// 8. Delete a Category (Admin)
export const deleteAdminCategoryAction = async (categoryId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return { success: false, error: "Unauthorized." };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.delete(`${apiUrl}/api/admin/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      message: res.data?.message || "Category deleted successfully.",
    };
  } catch (error: any) {
    console.error("deleteAdminCategoryAction error:", error?.response?.data || error?.message);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete category.",
    };
  }
};

// 9. Update a Category (Admin)
export const updateAdminCategoryAction = async (
  categoryId: string,
  payload: { name?: string; description?: string },
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return { success: false, error: "Unauthorized.", data: null };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.patch(`${apiUrl}/api/admin/categories/${categoryId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Category updated successfully.",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error("updateAdminCategoryAction error:", error?.response?.data || error?.message);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update category.",
      data: null,
    };
  }
};

// 10. Delete a Service (Admin)
export const deleteAdminServiceAction = async (serviceId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return { success: false, error: "Unauthorized." };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.delete(`${apiUrl}/api/admin/services/${serviceId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      message: res.data?.message || "Service deleted successfully.",
    };
  } catch (error: any) {
    console.error("deleteAdminServiceAction error:", error?.response?.data || error?.message);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete service.",
    };
  }
};

// 11. Update a Service (Admin)
export const updateAdminServiceAction = async (
  serviceId: string,
  payload: { name?: string; price?: number },
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return { success: false, error: "Unauthorized.", data: null };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.patch(`${apiUrl}/api/admin/services/${serviceId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: res.data?.message || "Service updated successfully.",
      data: res.data?.data || res.data,
    };
  } catch (error: any) {
    console.error("updateAdminServiceAction error:", error?.response?.data || error?.message);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update service.",
      data: null,
    };
  }
};
