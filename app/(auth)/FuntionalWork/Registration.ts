"use server";

import { axiosInstance } from "@/lib/axios";
import { RegUserType } from "./Typefile/Type";

export const RegistrationHandle = async (data: RegUserType) => {
  try {
    // Format payload for backend (mapping number -> phone, stripping confirmPassword)
    const { confirmPassword, number, ...rest } = data;
    const payload = {
      ...rest,
      phone: number || (data as any).phone || "",
    };

    const res = await axiosInstance.post("/api/auth/register", payload);
    return { success: true, data: res.data };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Registration failed. Please check your details.";
    return { success: false, error: message };
  }
};
