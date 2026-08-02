

import { axiosInstance } from "@/lib/axios";
import { LoginUserType } from "./LoginCard";

export const loginUser = async (data: LoginUserType) => {
  try {
    const res = await axiosInstance.post("/api/authlogin/login", data);
    console.log(res);
    return { success: true, data: res.data };
  } catch (error: any) {
    const message = error?.response?.data?.error;
    console.log(error);
    return { success: false, error: message };
  }
};
