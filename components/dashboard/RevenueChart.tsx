import type { RevenueDataPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/mock-data";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const chartHeight = 180;
  const barWidth = 48;
  const gap = 16;
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Revenue Overview</h3>
          <p className="text-xs text-muted-foreground">Monthly earnings from completed bookings</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
          </p>
          <p className="text-xs text-muted-foreground">Total (6 months)</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <svg
          width={totalWidth + 40}
          height={chartHeight + 40}
          className="mx-auto"
          aria-label="Revenue chart"
        >
          {data.map((point, i) => {
            const barHeight = (point.revenue / maxRevenue) * chartHeight;
            const x = 20 + i * (barWidth + gap);
            const y = chartHeight - barHeight + 10;

            return (
              <g key={point.month}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={6}
                  className="fill-primary/80 hover:fill-primary transition-colors"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 28}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px] font-medium"
                >
                  {point.month}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-semibold"
                >
                  {(point.revenue / 1000).toFixed(1)}k
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        {data.slice(-3).map((point) => (
          <div key={point.month} className="text-center">
            <p className="text-xs text-muted-foreground">{point.month}</p>
            <p className="text-sm font-bold text-foreground">{point.bookings} bookings</p>
          </div>
        ))}
      </div>
    </div>
  );
}
