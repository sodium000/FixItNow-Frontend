import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred.",
): string {
  if (error === null || error === undefined) {
    return fallback
  }

  // Handle Axios errors explicitly first to provide user-friendly status-based messages
  // and prevent showing raw backend technical errors.
  if (typeof error === "object" && error !== null && (error as any).isAxiosError) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    
    // If the caller provided a specific custom fallback, prioritize that for 4xx errors
    // as it usually has the most context-specific user-friendly text (e.g. "Login failed").
    const hasCustomFallback = fallback !== "An unexpected error occurred.";

    switch (status) {
      case 400:
        return hasCustomFallback ? fallback : "Invalid request. Please check your input and try again.";
      case 401:
        return "You are not authorized. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return hasCustomFallback ? fallback : "A conflict occurred. The resource might already exist.";
      case 422:
        return hasCustomFallback ? fallback : "Validation failed. Please check the data you entered.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "Our servers are experiencing issues. Please try again later.";
      default:
        // If it's a network error (no response)
        if (!axiosError.response) {
          return "Network error. Please check your internet connection.";
        }
        return fallback;
    }
  }

  if (typeof error === "string") {
    return error
  }

  if (typeof error === "number" || typeof error === "boolean") {
    return String(error)
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  if (typeof error === "object") {
    const err = error as Record<string, unknown>

    if (typeof err.message === "string") {
      return err.message
    }

    if (typeof err.error === "string") {
      return err.error
    }

    if (typeof err.code === "string") {
      const message = err.message
      return `${err.code}: ${message ?? ""}`.trim()
    }

    try {
      return JSON.stringify(err)
    } catch {
      return fallback
    }
  }

  return fallback
}
