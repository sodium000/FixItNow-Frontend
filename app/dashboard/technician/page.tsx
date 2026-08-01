"use client";

import * as React from "react";
import {
  Briefcase,
  DollarSign,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Camera,
  CheckCircle2,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import {
  CURRENT_TECHNICIAN,
  MOCK_BOOKINGS,
  formatCurrency,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TechnicianDashboardPage() {
  const [technician, setTechnician] = React.useState(CURRENT_TECHNICIAN);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = React.useState(technician.user?.photoUrl ?? "");
  const [successMessage, setSuccessMessage] = React.useState("");

  const myBookings = MOCK_BOOKINGS.filter((b) => b.technicianId === technician.id);
  const pendingJobs = myBookings.filter((b) => b.status === "PENDING");
  const activeJobs = myBookings.filter((b) => b.status === "ACCEPTED");
  const completedJobs = myBookings.filter((b) => b.status === "COMPLETED");
  const totalEarnings = completedJobs.reduce((sum, b) => sum + b.totalAmount, 0);

  const toggleAvailability = () => {
    setTechnician((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    setTechnician((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, photoUrl: newPhotoUrl.trim() } : prev.user,
    }));
    setIsPhotoModalOpen(false);
    setSuccessMessage("Profile picture updated successfully!");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const updateBookingStatus = (bookingId: string, status: "ACCEPTED" | "COMPLETED" | "CANCELLED") => {
    // Demo: would call API in production
    void bookingId;
    void status;
  };

  return (
    <DashboardShell defaultRole="TECHNICIAN">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Technician Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your jobs, availability, and profile picture.
            </p>
          </div>
          <Button
            variant={technician.isAvailable ? "default" : "outline"}
            onClick={toggleAvailability}
            className="gap-2"
          >
            {technician.isAvailable ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            {technician.isAvailable ? "Available for Jobs" : "Currently Unavailable"}
          </Button>
        </div>

        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Profile Summary */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Technician Avatar Profile Pic */}
              <div className="relative group shrink-0">
                <img
                  src={
                    technician.user?.photoUrl ||
                    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80"
                  }
                  alt={technician.user?.name ?? "Technician Profile"}
                  className="h-24 w-24 rounded-2xl border-2 border-primary/30 object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewPhotoUrl(technician.user?.photoUrl ?? "");
                    setIsPhotoModalOpen(true);
                  }}
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
                  title="Change Profile Picture"
                  aria-label="Change Profile Picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {technician.user?.name}
                  </h2>
                  {technician.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{technician.user?.email}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {technician.city}, {technician.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {technician.experienceYrs} yrs experience
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {technician.avgRating} ({technician.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              <div className="rounded-xl bg-muted/50 px-5 py-3 text-center">
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(technician.hourlyRate)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewPhotoUrl(technician.user?.photoUrl ?? "");
                  setIsPhotoModalOpen(true);
                }}
                className="gap-1.5"
              >
                <Camera className="h-3.5 w-3.5" />
                Change Picture
              </Button>
            </div>
          </div>
        </div>

        {/* Change Profile Picture Modal */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Update Profile Picture</h3>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdatePhoto} className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={
                      newPhotoUrl ||
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80"
                    }
                    alt="Preview"
                    className="h-28 w-28 rounded-2xl border-2 border-primary object-cover shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photoUrl">Photo URL</Label>
                  <Input
                    id="photoUrl"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Enter image URL..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="w-full" onClick={() => setIsPhotoModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full">
                    Save Picture
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Jobs"
            value={pendingJobs.length}
            subtitle="Need your response"
            icon={Briefcase}
          />
          <StatCard
            title="Active Jobs"
            value={activeJobs.length}
            subtitle="In progress"
            icon={Clock}
          />
          <StatCard
            title="Completed"
            value={completedJobs.length}
            subtitle="Total finished jobs"
            icon={ShieldCheck}
          />
          <StatCard
            title="Total Earnings"
            value={formatCurrency(totalEarnings)}
            subtitle="From completed jobs"
            icon={DollarSign}
          />
        </div>

        {/* Pending Jobs Actions */}
        {pendingJobs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Pending Requests</h2>
            <div className="grid gap-3">
              {pendingJobs.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">{booking.service?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.customer?.name} · {booking.address}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, "ACCEPTED")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Jobs */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">All Assigned Jobs</h2>
            <p className="text-sm text-muted-foreground">
              Complete history of your service assignments.
            </p>
          </div>
          <BookingsTable
            bookings={myBookings}
            showTechnician={false}
            emptyMessage="No jobs assigned yet."
          />
        </section>
      </div>
    </DashboardShell>
  );
}
