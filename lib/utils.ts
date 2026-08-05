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

    const axiosResponse = (err as any).response?.data
    if (axiosResponse) {
      return getErrorMessage(axiosResponse, fallback)
    }

    try {
      return JSON.stringify(err)
    } catch {
      return fallback
    }
  }

  return fallback
}
