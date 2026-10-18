// Formatting utilities (real data comes from the database API)

export function formatCurrency(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

export function formatDate(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getTechnicianName(id?: string): string {
  return id || "Unknown";
}
