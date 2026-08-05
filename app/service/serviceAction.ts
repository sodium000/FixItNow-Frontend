"use server";

import axios from "axios";
import { getErrorMessage } from "@/lib/utils";

export const getServicesAction = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.get(`${apiUrl}/api/services`);
    const services =
      res.data?.data?.services ||
      res.data?.services ||
      (Array.isArray(res.data?.data) ? res.data.data : []) ||
      (Array.isArray(res.data) ? res.data : []);

    return {
      success: true,
      data: services,
    };
  } catch (error: any) {
    console.error("Server Action fetch services error:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch services"),
      data: [],
    };
  }
};

export const getServiceByIdAction = async (serviceId: string) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.get(`${apiUrl}/api/services/${serviceId}`);
    const service =
      res.data?.data?.service || res.data?.service || res.data?.data || null;

    return {
      success: true,
      data: service,
    };
  } catch (error: any) {
    console.error("Server Action fetch service by ID error:", error);
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch service details"),
      data: null,
    };
  }
};
