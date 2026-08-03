"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  Bookmark,
  Star,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
  LogIn,
  TrendingUp,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import { formatCurrency, formatDate } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomerBookingChart } from "@/components/dashboard/CustomerBookingChart";
import { useQuery } from "@tanstack/react-query";
import { getMyProfileAction, type UserProfile } from "@/lib/profileAction";
import { getMyBookingsAction } from "@/app/booking/bookingAction";
import { useRouter } from "next/navigation";
import type { Booking } from "@/lib/types";

// Normalize a booking from API (totalAmount may be a string)
function normalizeBooking(raw: any): Booking {
  return {
    ...raw,
    totalAmount:
      typeof raw.totalAmount === "string"
        ? parseFloat(raw.totalAmount) || 0
        : raw.totalAmount ?? 0,
  };
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [techForm, setTechForm] = React.useState({
    experienceYrs: 1,
    hourlyRate: 25,
    address: "",
    city: "Dhaka",
  });

  // Fetch real logged-in user from /api/auth/me
  const {
    data: user,
    isLoading: isProfileLoading,
    isError,
    error,
  } = useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const result = await getMyProfileAction();
      if (!result.success) throw new Error(result.error || "Unauthorized");
      return result.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch real bookings from /api/bookings
  const { data: rawBookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const result = await getMyBookingsAction();
      return result.success && Array.isArray(result.data) ? result.data : [];
    },
    enabled: !!user, // only fetch once user is known
    staleTime: 1000 * 60 * 1,
  });

  // Normalize & cast bookings to proper Booking type
  const customerBookings: Booking[] = React.useMemo(
    () => rawBookings.map(normalizeBooking),
    [rawBookings],
  );

  // Analytics derived from real bookings
  const completedCount = customerBookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;
  const pendingCount = customerBookings.filter(
    (b) => b.status === "PENDING",
  ).length;
  const acceptedCount = customerBookings.filter(
    (b) => b.status === "ACCEPTED",
  ).length;
  const totalSpent = customerBookings
    .filter((b) => b.status === "COMPLETED" || b.status === "ACCEPTED")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handleBecomeTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setSuccessMessage(
      "Technician application submitted! We'll review your profile shortly.",
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const isLoading = isProfileLoading;

  // ── Loading ──
  if (isLoading) {
    return (
      <DashboardShell defaultRole="CUSTOMER">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading your profile...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // ── Unauthenticated / Error ──
  if (isError || !user) {
    return (
      <DashboardShell defaultRole="CUSTOMER">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="max-w-sm w-full rounded-2xl border border-border bg-card p-8 text-center space-y-4 shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Login Required
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {(error as Error)?.message ||
                  "You must be logged in to view your dashboard."}
              </p>
            </div>
            <Button
              className="w-full gap-2"
              onClick={() => router.push("/login")}
            >
              <LogIn className="h-4 w-4" />
              Sign In to Continue
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Initials fallback for avatar
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardShell defaultRole="CUSTOMER">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your profile, bookings, and service history.
            </p>
          </div>
          <Button asChild>
            <Link href="/booking">
              Book a Service
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Profile Card — Real Data from /api/auth/me */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                className="h-24 w-24 rounded-2xl border-2 border-border object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl border-2 border-border bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-extrabold text-primary">
                  {initials}
                </span>
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {user.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      user.isActive
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-red-500/15 text-red-600"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user.phone ?? "No phone added"}
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Joined {formatDate(user.createdAt)}
                </div>
              </div>

              {!user.technicianProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Become a Technician
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats — Real Data from /api/bookings */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={
              isBookingsLoading ? "..." : customerBookings.length
            }
            subtitle="All time orders"
            icon={Bookmark}
          />
          <StatCard
            title="Completed"
            value={isBookingsLoading ? "..." : completedCount}
            subtitle="Successfully finished"
            icon={CheckCircle2}
          />
          <StatCard
            title="Pending / Accepted"
            value={isBookingsLoading ? "..." : pendingCount + acceptedCount}
            subtitle="Awaiting / In progress"
            icon={Clock}
          />
          <StatCard
            title="Total Spent"
            value={
              isBookingsLoading ? "..." : formatCurrency(totalSpent)
            }
            subtitle="Completed & accepted services"
            icon={TrendingUp}
          />
        </div>

        {/* Bookings Section — Real Data */}
        <section id="bookings" className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                My Bookings
              </h2>
              <p className="text-sm text-muted-foreground">
                Your real service booking history, spending, and technician assignments from database.
              </p>
            </div>
          </div>

          {isBookingsLoading ? (
            <div className="flex items-center justify-center py-16 rounded-2xl border border-border bg-card">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <p className="text-sm font-medium">Loading your bookings...</p>
              </div>
            </div>
          ) : (
            <>
              <CustomerBookingChart bookings={customerBookings} />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  Service History Table
                </h3>
                <BookingsTable
                  bookings={customerBookings}
                  showCustomer={false}
                  showTechnician={true}
                  emptyMessage="You haven't booked any services yet. Book your first service!"
                />
              </div>
            </>
          )}
        </section>
      </div>

      {/* Become Technician Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                Become a Technician
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleBecomeTechnician} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experienceYrs">Years of Experience</Label>
                <Input
                  id="experienceYrs"
                  type="number"
                  min={0}
                  value={techForm.experienceYrs}
                  onChange={(e) =>
                    setTechForm((p) => ({
                      ...p,
                      experienceYrs: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (৳)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min={0}
                  value={techForm.hourlyRate}
                  onChange={(e) =>
                    setTechForm((p) => ({
                      ...p,
                      hourlyRate: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={techForm.address}
                  onChange={(e) =>
                    setTechForm((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="Your service area address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={techForm.city}
                  onChange={(e) =>
                    setTechForm((p) => ({ ...p, city: e.target.value }))
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
