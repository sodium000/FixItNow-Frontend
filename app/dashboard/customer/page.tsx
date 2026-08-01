"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  Bookmark,
  Star,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import {
  CURRENT_USER,
  MOCK_BOOKINGS,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CustomerBookingChart } from "@/components/dashboard/CustomerBookingChart";

export default function CustomerDashboardPage() {
  const [user] = React.useState(CURRENT_USER);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [techForm, setTechForm] = React.useState({
    experienceYrs: 1,
    hourlyRate: 25,
    address: "",
    city: "Dhaka",
  });

  const customerBookings = MOCK_BOOKINGS.filter((b) => b.customerId === user.id);
  const completedCount = customerBookings.filter((b) => b.status === "COMPLETED").length;
  const pendingCount = customerBookings.filter((b) => b.status === "PENDING").length;
  const totalSpent = customerBookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleBecomeTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setSuccessMessage("Technician application submitted! We'll review your profile shortly.");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <DashboardShell defaultRole="CUSTOMER">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {user.name.split(" ")[0]}
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

        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <img
              src={
                user.photoUrl ??
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop"
              }
              alt={user.name}
              className="h-24 w-24 rounded-2xl border-2 border-border object-cover"
            />
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
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

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Become a Technician
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={customerBookings.length}
            subtitle="All time orders"
            icon={Bookmark}
          />
          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Successfully finished"
            icon={CheckCircle2}
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            subtitle="Awaiting confirmation"
            icon={Calendar}
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            subtitle="On completed services"
            icon={Star}
          />
        </div>

        {/* Bookings Section with Modern Chart and Table */}
        <section id="bookings" className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                My Bookings
              </h2>
              <p className="text-sm text-muted-foreground">
                Detailed history of your service requests, spending, and technician assignments.
              </p>
            </div>
          </div>

          {/* Customer Spending & Volume Chart */}
          <CustomerBookingChart bookings={customerBookings} />

          {/* Best Modern Bookings Table */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground">Service History Table</h3>
            <BookingsTable
              bookings={customerBookings}
              showCustomer={false}
              showTechnician={true}
              emptyMessage="You haven't booked any services yet."
            />
          </div>
        </section>
      </div>

      {/* Become Technician Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Become a Technician</h3>
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
                    setTechForm((p) => ({ ...p, experienceYrs: Number(e.target.value) }))
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
                    setTechForm((p) => ({ ...p, hourlyRate: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={techForm.address}
                  onChange={(e) => setTechForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Your service area address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={techForm.city}
                  onChange={(e) => setTechForm((p) => ({ ...p, city: e.target.value }))}
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
