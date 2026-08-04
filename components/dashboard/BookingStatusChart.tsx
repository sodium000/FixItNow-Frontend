"use client";

import * as React from "react";
import type { Booking } from "@/lib/types";

interface BookingStatusChartProps {
  bookings: Booking[];
}

export function BookingStatusChart({ bookings }: BookingStatusChartProps) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const completed = safeBookings.filter(
    (b) => b?.status === "COMPLETED",
  ).length;
  const accepted = safeBookings.filter((b) => b?.status === "ACCEPT").length;
  const pending = safeBookings.filter((b) => b?.status === "PENDING").length;
  const cancelled = safeBookings.filter(
    (b) => b?.status === "CANCELLED",
  ).length;
  const total = safeBookings.length || 1;

  const data = [
    {
      label: "Completed",
      count: completed,
      color: "#10b981",
      percent: Math.round((completed / total) * 100),
    },
    {
      label: "Accepted",
      count: accepted,
      color: "#3b82f6",
      percent: Math.round((accepted / total) * 100),
    },
    {
      label: "Pending",
      count: pending,
      color: "#f59e0b",
      percent: Math.round((pending / total) * 100),
    },
    {
      label: "Cancelled",
      count: cancelled,
      color: "#ef4444",
      percent: Math.round((cancelled / total) * 100),
    },
  ];

  // Calculate SVG Donut slice arcs
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">
          Booking Status Breakdown
        </h3>
        <p className="text-xs text-muted-foreground">
          Distribution of service requests by current status
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* SVG Donut Chart */}
        <div className="relative flex items-center justify-center">
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="transform -rotate-90"
          >
            {data.map((slice) => {
              if (slice.count === 0) return null;
              const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -(
                (accumulatedPercent / 100) *
                circumference
              );
              accumulatedPercent += slice.percent;

              return (
                <circle
                  key={slice.label}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="22"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-85"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-foreground">
              {bookings.length}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Bookings
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full flex-1 space-y-2.5">
          {data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl bg-muted/40 px-3.5 py-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-foreground">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-muted-foreground">
                  {item.count} jobs
                </span>
                <span className="w-9 text-right font-bold text-foreground">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
