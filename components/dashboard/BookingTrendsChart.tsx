"use client";

import type { RevenueDataPoint } from "@/lib/types";

interface BookingTrendsChartProps {
  data: RevenueDataPoint[];
}

export function BookingTrendsChart({ data = [] }: BookingTrendsChartProps) {
  const width = 700;
  const height = 260;
  const padding = 40;

  if (!data.length) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Monthly Booking Trends</h3>

        <div className="flex h-60 items-center justify-center text-muted-foreground">
          No booking data available.
        </div>
      </div>
    );
  }

  const maxBookings = Math.max(...data.map((d) => Number(d.bookings) || 0), 1);

  const denominator = Math.max(data.length - 1, 1);

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / denominator;

    const y =
      height -
      padding -
      ((Number(item.bookings) || 0) / maxBookings) * (height - padding * 2);

    return {
      ...item,
      x,
      y,
    };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const area = `${line}
     L ${points[points.length - 1].x} ${height - padding}
     L ${points[0].x} ${height - padding}
     Z`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Monthly Booking Trends</h3>

        <p className="text-sm text-muted-foreground">
          Booking volume over time
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* X axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#d4d4d8"
        />

        {/* Area */}
        <path d={area} fill="url(#gradient)" />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke="#2563eb"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r={5} fill="#2563eb" />

            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
            >
              {point.bookings}
            </text>

            <text
              x={point.x}
              y={height - 15}
              textAnchor="middle"
              fontSize="11"
              fill="#71717a"
            >
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
