"use client";

import * as React from "react";
import type { Booking, ServiceCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/mock-data";

interface CategoryShareChartProps {
  categories: ServiceCategory[];
  bookings: Booking[];
}

export function CategoryShareChart({ categories, bookings }: CategoryShareChartProps) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const categoryStats = safeCategories.map((cat) => {
    const services = Array.isArray(cat?.services) ? cat.services : [];
    const catServicesIds = services.map((s) => s?.id).filter(Boolean);
    const catBookings = safeBookings.filter(
      (b) => catServicesIds.includes(b?.serviceId) || (b?.service?.categoryName && b.service.categoryName === cat?.name)
    );
    const revenue = catBookings
      .filter((b) => b?.status === "COMPLETED")
      .reduce((sum, b) => {
        const amt = typeof b?.totalAmount === "number" ? b.totalAmount : parseFloat(b?.totalAmount as any) || 0;
        return sum + amt;
      }, 0);

    return {
      id: cat?.id || cat?.name || Math.random().toString(),
      name: cat?.name || "Category",
      bookingsCount: catBookings.length,
      revenue,
    };
  });

  const maxRevenue = Math.max(...categoryStats.map((c) => c.revenue), 1);
  const totalRevenue = categoryStats.reduce((sum, c) => sum + c.revenue, 0);

  const colors = ["#8b5cf6", "#06b6d4", "#f43f5e", "#10b981"];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Service Category Revenue Share</h3>
          <p className="text-xs text-muted-foreground">Earnings performance grouped by service type</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          {categories.length} Categories
        </span>
      </div>

      <div className="space-y-4">
        {categoryStats.map((stat, idx) => {
          const color = colors[idx % colors.length];
          const percent = totalRevenue > 0 ? Math.round((stat.revenue / totalRevenue) * 100) : 0;
          const barWidthPercent = Math.max(Math.round((stat.revenue / maxRevenue) * 100), 8);

          return (
            <div key={stat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="font-semibold text-foreground">{stat.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{stat.bookingsCount} orders</span>
                  <span className="font-bold text-foreground">{formatCurrency(stat.revenue)}</span>
                  <span className="w-8 text-right font-bold text-primary">{percent}%</span>
                </div>
              </div>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barWidthPercent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
