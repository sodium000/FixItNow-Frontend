"use client";

import * as React from "react";
import type { RevenueDataPoint } from "@/lib/types";

interface BookingTrendsChartProps {
  data: RevenueDataPoint[];
}

export function BookingTrendsChart({ data }: BookingTrendsChartProps) {
  const maxBookings = Math.max(...data.map((d) => d.bookings), 1);
  const width = 500;
  const height = 180;
  const padding = 30;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((d.bookings / (maxBookings + 2)) * (height - 2 * padding));
    return { x, y, month: d.month, bookings: d.bookings, revenue: d.revenue };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Monthly Booking Volume Trends</h3>
          <p className="text-xs text-muted-foreground">Order activity trajectory across 6 months</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Booking Volume
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[220px]"
          aria-label="Booking trends chart"
        >
          <defs>
            <linearGradient id="bookingTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="currentColor"
            className="text-border"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="currentColor"
            className="text-border"
            strokeDasharray="4 4"
          />

          {/* Area under line */}
          <path d={areaD} fill="url(#bookingTrendGradient)" />

          {/* Trend line */}
          <path
            d={pathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p) => (
            <g key={p.month} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#3b82f6"
                className="transition-all duration-200 group-hover:r-7 stroke-background stroke-2"
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-bold opacity-80 group-hover:opacity-100"
              >
                {p.bookings}
              </text>
              <text
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-muted-foreground text-[11px] font-medium"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
