import type { Booking } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";

interface BookingsTableProps {
  bookings: Booking[];
  showCustomer?: boolean;
  showTechnician?: boolean;
  emptyMessage?: string;
}

export function BookingsTable({
  bookings,
  showCustomer = true,
  showTechnician = true,
  emptyMessage = "No bookings found.",
}: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-semibold">Service</th>
            {showCustomer && <th className="px-4 py-3 font-semibold">Customer</th>}
            {showTechnician && <th className="px-4 py-3 font-semibold">Technician</th>}
            <th className="px-4 py-3 font-semibold">Scheduled</th>
            <th className="px-4 py-3 font-semibold">Address</th>
            <th className="px-4 py-3 font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3.5">
                <p className="font-semibold text-foreground">
                  {booking.service?.name ?? "Unknown Service"}
                </p>
                {booking.service?.categoryName && (
                  <p className="text-xs text-muted-foreground">{booking.service.categoryName}</p>
                )}
              </td>
              {showCustomer && (
                <td className="px-4 py-3.5 text-muted-foreground">
                  {booking.customer?.name ?? "—"}
                </td>
              )}
              {showTechnician && (
                <td className="px-4 py-3.5 text-muted-foreground">
                  {booking.technician?.user?.name ?? "—"}
                </td>
              )}
              <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                {formatDateTime(booking.scheduledAt)}
              </td>
              <td className="px-4 py-3.5 text-muted-foreground max-w-[180px] truncate">
                {booking.address}
              </td>
              <td className="px-4 py-3.5 font-semibold text-foreground whitespace-nowrap">
                {formatCurrency(booking.totalAmount)}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
