import type { BookingStatus } from "@/lib/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  COMPLETED:
    "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  ACCEPTED: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  PENDING:
    "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  CANCELLED: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
};

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
