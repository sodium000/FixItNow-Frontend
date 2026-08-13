"use server";

import { axiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { RegUserType } from "./Typefile/Type";

export const RegistrationHandle = async (data: RegUserType) => {
  try {
    const { number, photo, ...rest } = data;
    const payload = {
      ...rest,
      phone: number,
      photoUrl: photo,
    };

    console.log(payload)

    const res = await axiosInstance.post("/api/auth/register", payload);
    return { success: true, data: res.data };
  } catch (error: any) {
    const message = getErrorMessage(
      error,
      "Registration failed. Please check your details.",
    );
    return { success: false, error: message };
  }
};
