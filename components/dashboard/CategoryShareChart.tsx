"use client";

import { formatCurrency } from "@/lib/mock-data";

interface CategoryShareChartProps {
  categories: any[];
  bookings: any[];
}

export function CategoryShareChart({
  categories = [],
  bookings = [],
}: CategoryShareChartProps) {
  const safeServices = Array.isArray(categories) ? categories : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // Group services by category
  const categoryMap = new Map();

  safeServices.forEach((service) => {
    if (!service?.category) return;

    const categoryId = service.category.id;

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        id: categoryId,
        name: service.category.name,
      });
    }
  });

  const uniqueCategories = Array.from(categoryMap.values());

  const categoryStats = uniqueCategories.map((category: any) => {
    const categoryBookings = safeBookings.filter(
      (booking) => booking?.service?.categoryId === category.id,
    );

    const completedBookings = categoryBookings.filter(
      (booking) => booking.status === "COMPLETED",
    );

    const revenue = completedBookings.reduce(
      (sum, booking) => sum + Number(booking.totalAmount ?? 0),
      0,
    );

    return {
      id: category.id,
      name: category.name,
      bookingsCount: categoryBookings.length,
      revenue,
    };
  });

  const maxRevenue = Math.max(...categoryStats.map((item) => item.revenue), 1);

  const totalRevenue = categoryStats.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  const colors = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
    "#EC4899",
    "#14B8A6",
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Category Revenue</h3>

          <p className="text-sm text-muted-foreground">
            Revenue grouped by service category
          </p>
        </div>

        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {uniqueCategories.length} Categories
        </div>
      </div>

      {categoryStats.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          No category data available.
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
              <div key={item.id}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {item.bookingsCount} Bookings
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.revenue)}</p>

                    <p className="text-xs text-primary">{percent}%</p>
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
