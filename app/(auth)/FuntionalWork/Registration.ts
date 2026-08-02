"use server";

import { axiosInstance } from "@/lib/axios";
import { RegUserType } from "./Typefile/Type";

export const RegistrationHandle = async (data: RegUserType) => {
  console.log(data, "Registration Form Data");
  try {
    const res = await axiosInstance.post("/api/auth/register", data);
    console.log("Registration success:", res.data);
    return { success: true, data: res.data };
  } catch (error: any) {
    const message = error?.response?.data?.error;
    console.log(message);
    return { success: false, error: message };
  }
};
