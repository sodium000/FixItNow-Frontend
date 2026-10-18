"use client";

import * as React from "react";
import { Search, Calendar, MapPin, Wrench, Star } from "lucide-react";
import type { Booking, BookingStatus } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";

interface BookingsTableProps {
  bookings: Booking[];
  showCustomer?: boolean;
  showTechnician?: boolean;
  emptyMessage?: string;
  /** Called when the user clicks "Leave Review" on a completed booking */
  onReview?: (bookingId: string) => void;
  /** Set of bookingIds that already have a review submitted */
  reviewedIds?: Set<string>;
}

export function BookingsTable({
  bookings,
  showCustomer = true,
  showTechnician = true,
  emptyMessage = "No bookings found.",
  onReview,
  reviewedIds = new Set(),
}: BookingsTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<
    BookingStatus | "ALL"
  >("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Filter bookings based on search & selected status
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus =
        selectedStatus === "ALL" || b.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStatus;

      const serviceName = b.service?.name?.toLowerCase() ?? "";
      const catName = b.service?.categoryName?.toLowerCase() ?? "";
      const techName = b.technician?.user?.name?.toLowerCase() ?? "";
      const custName = b.customer?.name?.toLowerCase() ?? "";
      const address = b.address?.toLowerCase() ?? "";

      const matchesSearch =
        serviceName.includes(q) ||
        catName.includes(q) ||
        techName.includes(q) ||
        custName.includes(q) ||
        address.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, searchQuery, selectedStatus]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const visibleBookings = filteredBookings.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    ACCEPT: bookings.filter((b) => b.status === "ACCEPT").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between bg-muted/20">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service, technician, address..."
            className="h-9 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-1 text-xs">
          {(["ALL", "PENDING", "ACCEPT", "COMPLETED"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                selectedStatus === st
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-background text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
              <span className="ml-1.5 rounded-full bg-muted/80 px-1.5 py-0.2 text-[10px]">
                {statusCounts[st]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Table Body */}
      {filteredBookings.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {searchQuery || selectedStatus !== "ALL"
            ? "No bookings match your search filters."
            : emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-bold">Service Info</th>
                {showCustomer && (
                  <th className="px-5 py-3.5 font-bold">Customer</th>
                )}
                {showTechnician && (
                  <th className="px-5 py-3.5 font-bold">Technician</th>
                )}
                <th className="px-5 py-3.5 font-bold">Scheduled Time</th>
                <th className="px-5 py-3.5 font-bold">Location</th>
                <th className="px-5 py-3.5 font-bold">Amount</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                {onReview && <th className="px-5 py-3.5 font-bold">Review</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {/* Service Info with Icon */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {booking.service?.name ?? "Service Job"}
                        </p>
                        {booking.service?.categoryName && (
                          <span className="mt-0.5 inline-block text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                            {booking.service.categoryName}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Customer Avatar & Name */}
                  {showCustomer && (
                    <td className="px-5 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2.5">
                        <div
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-primary/10 text-xs font-bold text-primary"
                        >
                          {booking.customer?.name?.slice(0, 1).toUpperCase() || "C"}
                        </div>
                        <span className="font-semibold text-foreground text-xs">
                          {booking.customer?.name ?? "—"}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Technician Avatar & Name */}
                  {showTechnician && (
                    <td className="px-5 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2.5">
                        <div
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-primary/10 text-xs font-bold text-primary"
                        >
                          {booking.technician?.user?.name?.slice(0, 1).toUpperCase() || "T"}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xs">
                            {booking.technician?.user?.name ?? "Assigned Tech"}
                          </p>
                          {booking.technician?.avgRating && (
                            <p className="text-[10px] text-amber-500 font-bold">
                              ★ {booking.technician?.avgRating}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Scheduled Time */}
                  <td className="px-5 py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDateTime(booking.scheduledAt)}
                    </div>
                  </td>

                  {/* Location Address */}
                  <td className="px-5 py-4 text-xs text-muted-foreground max-w-45 truncate">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 font-bold text-foreground text-sm whitespace-nowrap">
                    {formatCurrency(booking.totalAmount)}
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Review Action */}
                  {onReview && (
                    <td className="px-5 py-4">
                      {booking.status === "COMPLETED" ? (
                        reviewedIds.has(booking.id) ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-amber-500" />
                            Reviewed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onReview(booking.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground px-2.5 py-1.5 rounded-full border border-primary/20 transition-all"
                          >
                            <Star className="w-3 h-3" />
                            Leave Review
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filteredBookings.length > 0 && (
        <nav
          aria-label="Booking table pages"
          className="flex items-center justify-between border-t border-border px-4 py-3"
        >
          <p className="text-xs text-muted-foreground">
            Showing {(visiblePage - 1) * pageSize + 1}–
            {Math.min(visiblePage * pageSize, filteredBookings.length)} of{" "}
            {filteredBookings.length}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={visiblePage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-muted-foreground">
                Page {visiblePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={visiblePage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
