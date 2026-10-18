"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/mock-data";

interface CategoryShareChartProps {
  categories?: any[];
  bookings?: any[];
}

export function CategoryShareChart({
  categories = [],
  bookings = [],
}: CategoryShareChartProps) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // Group and extract categories from both the categories prop AND bookings
  const categoryMap = new Map<string, { id: string; name: string }>();

  // 1. Ingest from categories prop (handles { id, name } or { category: { id, name } })
  safeCategories.forEach((item: any) => {
    if (!item) return;
    if (item.id && item.name) {
      categoryMap.set(String(item.id), {
        id: String(item.id),
        name: String(item.name),
      });
    } else if (item.category?.id && item.category?.name) {
      categoryMap.set(String(item.category.id), {
        id: String(item.category.id),
        name: String(item.category.name),
      });
    }
  });

  // 2. Also ingest from bookings (in case categories list has not loaded or differs)
  safeBookings.forEach((b: any) => {
    const cat = b?.service?.category;
    if (cat?.id && cat?.name) {
      if (!categoryMap.has(String(cat.id))) {
        categoryMap.set(String(cat.id), {
          id: String(cat.id),
          name: String(cat.name),
        });
      }
    }
  });

  const uniqueCategories = Array.from(categoryMap.values());

  const categoryStats = uniqueCategories
    .map((category) => {
      // Find all bookings belonging to this category
      const categoryBookings = safeBookings.filter((booking: any) => {
        const sCatId = booking?.service?.categoryId;
        const bCatId = booking?.service?.category?.id || booking?.categoryId;
        const bCatName =
          booking?.service?.category?.name || booking?.categoryName;
        return (
          String(sCatId) === category.id ||
          String(bCatId) === category.id ||
          (bCatName &&
            bCatName.trim().toLowerCase() === category.name.trim().toLowerCase())
        );
      });

      // Sum completed revenue first
      const completedBookings = categoryBookings.filter(
        (booking: any) => booking.status === "COMPLETED",
      );

      const completedRevenue = completedBookings.reduce(
        (sum: number, booking: any) =>
          sum + Number(booking.totalAmount ?? booking.price ?? 0),
        0,
      );

      // Total booking revenue (completed or active)
      const allRevenue = categoryBookings.reduce(
        (sum: number, booking: any) =>
          sum + Number(booking.totalAmount ?? booking.price ?? 0),
        0,
      );

      const revenue = completedRevenue > 0 ? completedRevenue : allRevenue;

      return {
        id: category.id,
        name: category.name,
        bookingsCount: categoryBookings.length,
        revenue,
      };
    })
    // Sort categories with highest revenue first, then highest booking count
    .sort((a, b) => b.revenue - a.revenue || b.bookingsCount - a.bookingsCount);

  const maxRevenue = Math.max(...categoryStats.map((item) => item.revenue), 1);

  const totalRevenue = categoryStats.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  const colors = [
    "#8B5CF6", // purple
    "#06B6D4", // cyan
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // rose
    "#6366F1", // indigo
    "#EC4899", // pink
    "#14B8A6", // teal
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Service Category Revenue
          </h3>
          <p className="text-sm text-muted-foreground">
            Revenue and booking volume grouped by service category
          </p>
        </div>

        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {uniqueCategories.length} Categories
        </div>
      </div>

      {categoryStats.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No category revenue data available.
        </div>
      ) : (
        <div className="max-h-[350px] space-y-5 overflow-y-auto pr-2">
          {categoryStats.map((item, index) => {
            const percent =
              totalRevenue === 0
                ? 0
                : Math.round((item.revenue / totalRevenue) * 100);

            const width =
              totalRevenue === 0
                ? 8
                : Math.max((item.revenue / maxRevenue) * 100, 8);

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.bookingsCount} Booking
                      {item.bookingsCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {formatCurrency(item.revenue)}
                    </p>
                    <p className="text-xs font-semibold text-primary">
                      {percent}%
                    </p>
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${width}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
