/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Link from "next/link";
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
  Loader2,
  AlertCircle,
  LogIn,
  Pencil,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import { formatCurrency, formatDateTime } from "@/lib/mock-data";
import type { Booking, BookingStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getTechnicianProfileAction,
  getTechnicianBookingsAction,
  updateTechnicianProfileAction,
  updateTechnicianAvailabilityAction,
  updateTechnicianBookingStatusAction,
  type TechnicianProfileResponse,
} from "@/app/technician/technicianAction";

function normalizeBooking(raw: any): Booking {
  return {
    ...raw,
    totalAmount:
      typeof raw.totalAmount === "string"
        ? parseFloat(raw.totalAmount) || 0
        : (raw.totalAmount ?? 0),
    service: raw.service
      ? {
          ...raw.service,
          categoryName:
            raw.service.category?.name || raw.service.categoryName || undefined,
        }
      : undefined,
  };
}

type ProfileFormState = {
  name: string;
  phone: string;
  experienceYrs: number;
  hourlyRate: number;
  address: string;
  city: string;
};

function buildProfileForm(
  technician: TechnicianProfileResponse,
): ProfileFormState {
  return {
    name: technician.user?.name ?? "",
    phone: technician.user?.phone ?? "",
    experienceYrs: technician.experienceYrs ?? 1,
    hourlyRate: technician.hourlyRate ?? 500,
    address: technician.address ?? "",
    city: technician.city ?? "Dhaka",
  };
}

export default function TechnicianDashboardPage() {
  const queryClient = useQueryClient();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isTogglingAvailability, setIsTogglingAvailability] =
    React.useState(false);
  const [updatingBookingId, setUpdatingBookingId] = React.useState<
    string | null
  >(null);
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = React.useState(false);

  const [profileDraft, setProfileDraft] =
    React.useState<ProfileFormState | null>(null);
  const [photoDraft, setPhotoDraft] = React.useState("");

  const {
    data: technician,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery<TechnicianProfileResponse | null>({
    queryKey: ["technicianProfile"],
    queryFn: async () => {
      const result = await getTechnicianProfileAction();
      if (!result.success)
        throw new Error(result.error || "Failed to load profile");
      return result.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  const { data: rawBookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ["technicianBookings"],
    queryFn: async () => {
      const result = await getTechnicianBookingsAction();
      if (!result.success)
        throw new Error(result.error || "Failed to load bookings");
      return Array.isArray(result.data) ? result.data : [];
    },
    enabled: !!technician,
    staleTime: 1000 * 60 * 1,
  });

  const myBookings: Booking[] = React.useMemo(
    () => rawBookings.map(normalizeBooking),
    [rawBookings],
  );

  const openProfileModal = () => {
    if (!technician) return;
    setProfileDraft(buildProfileForm(technician));
    setIsProfileModalOpen(true);
  };

  const openPhotoModal = () => {
    if (!technician) return;
    setPhotoDraft(technician.user?.photoUrl ?? "");
    setIsPhotoModalOpen(true);
  };

  const pendingJobs = myBookings.filter((b) => b.status === "PENDING");
  const activeJobs = myBookings.filter((b) => b.status === "ACCEPT");
  const completedJobs = myBookings.filter((b) => b.status === "COMPLETED");
  const totalEarnings = completedJobs.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0,
  );

  const toggleAvailability = async () => {
    if (!technician) return;
    const next = !technician.isAvailable;
    setIsTogglingAvailability(true);
    const toastId = toast.loading(
      next ? "Going online..." : "Going offline...",
    );
    const res = await updateTechnicianAvailabilityAction(next);
    setIsTogglingAvailability(false);

    if (res.success) {
      toast.success(
        next ? "You are now available for jobs!" : "You are now offline.",
        {
          id: toastId,
        },
      );
      queryClient.invalidateQueries({ queryKey: ["technicianProfile"] });
    } else {
      toast.error(res.error || "Failed to update availability.", {
        id: toastId,
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDraft) return;
    setIsSavingProfile(true);
    const toastId = toast.loading("Saving profile...");
    const res = await updateTechnicianProfileAction({
      name: profileDraft.name,
      phone: profileDraft.phone,
      experienceYrs: profileDraft.experienceYrs,
      hourlyRate: profileDraft.hourlyRate,
      address: profileDraft.address,
      city: profileDraft.city,
    });
    setIsSavingProfile(false);

    if (res.success) {
      toast.success("Profile updated successfully!", { id: toastId });
      setIsProfileModalOpen(false);
      setProfileDraft(null);
      queryClient.invalidateQueries({ queryKey: ["technicianProfile"] });
    } else {
      toast.error(res.error || "Failed to update profile.", { id: toastId });
    }
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoDraft.trim()) return;
    setIsSavingPhoto(true);
    const toastId = toast.loading("Updating profile picture...");
    const res = await updateTechnicianProfileAction({
      photoUrl: photoDraft.trim(),
    });
    setIsSavingPhoto(false);

    if (res.success) {
      toast.success("Profile picture updated!", { id: toastId });
      setIsPhotoModalOpen(false);
      setPhotoDraft("");
      queryClient.invalidateQueries({ queryKey: ["technicianProfile"] });
    } else {
      toast.error(res.error || "Failed to update photo.", { id: toastId });
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
  ) => {
    setUpdatingBookingId(bookingId);
    const toastId = toast.loading(
      `Updating booking to ${status.toLowerCase()}...`,
    );
    const res = await updateTechnicianBookingStatusAction(bookingId, status);
    setUpdatingBookingId(null);

    if (res.success) {
      toast.success(res.message || "Booking updated!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["technicianBookings"] });
    } else {
      toast.error(res.error || "Failed to update booking.", { id: toastId });
    }
  };

  if (isProfileLoading) {
    return (
      <DashboardShell defaultRole="TECHNICIAN">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading technician profile...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (isProfileError || !technician) {
    const errorMessage =
      (profileError as Error)?.message ||
      "Please log in as a technician to access this dashboard.";
    const isAuthError =
      errorMessage.toLowerCase().includes("not authenticated") ||
      errorMessage.toLowerCase().includes("log in");

    return (
      <DashboardShell defaultRole="TECHNICIAN">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="max-w-sm w-full rounded-2xl border border-border bg-card p-8 text-center space-y-4 shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Unable to load profile
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            {isAuthError ? (
              <Button asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/dashboard/customer">Go to Customer Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell defaultRole="TECHNICIAN">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Technician Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your profile, availability, and assigned bookings from the
              API.
            </p>
          </div>
          <Button
            variant={technician.isAvailable ? "default" : "outline"}
            onClick={toggleAvailability}
            disabled={isTogglingAvailability}
            className="gap-2"
          >
            {isTogglingAvailability ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : technician.isAvailable ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            {technician.isAvailable
              ? "Available for Jobs"
              : "Currently Unavailable"}
          </Button>
        </div>

        {/* Profile Summary */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
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
                  onClick={openPhotoModal}
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
                <p className="mt-1 text-sm text-muted-foreground">
                  {technician.user?.email}
                </p>
                {technician.user?.phone && (
                  <p className="text-sm text-muted-foreground">
                    {technician.user.phone}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {[technician.city, technician.address]
                      .filter(Boolean)
                      .join(", ") || "No address set"}
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

            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <div className="rounded-xl bg-muted/50 px-5 py-3 text-center">
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(technician.hourlyRate)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openProfileModal}
                className="gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Jobs"
            value={isBookingsLoading ? "..." : pendingJobs.length}
            subtitle="Need your response"
            icon={Briefcase}
          />
          <StatCard
            title="Active Jobs"
            value={isBookingsLoading ? "..." : activeJobs.length}
            subtitle="In progress"
            icon={Clock}
          />
          <StatCard
            title="Completed"
            value={isBookingsLoading ? "..." : completedJobs.length}
            subtitle="Total finished jobs"
            icon={CheckCircle2}
          />
          <StatCard
            title="Total Earnings"
            value={isBookingsLoading ? "..." : formatCurrency(totalEarnings)}
            subtitle="From completed jobs"
            icon={DollarSign}
          />
        </div>

        {/* Pending Jobs */}
        {pendingJobs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              Pending Requests
            </h2>
            <div className="grid gap-3">
              {pendingJobs.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {booking.service?.name ?? "Service Job"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.customer?.name ?? "Customer"} · {booking.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(booking.scheduledAt)}
                    </p>
                    {booking.notes && (
                      <p className="mt-1 text-xs italic text-muted-foreground">
                        Note: {booking.notes}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={updatingBookingId === booking.id}
                      onClick={() => updateBookingStatus(booking.id, "ACCEPT")}
                    >
                      {updatingBookingId === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Accept"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingBookingId === booking.id}
                      onClick={() => updateBookingStatus(booking.id, "DECLINE")}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active Jobs - Mark Complete */}
        {activeJobs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Active Jobs</h2>
            <div className="grid gap-3">
              {activeJobs.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {booking.service?.name ?? "Service Job"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.customer?.name ?? "Customer"} · {booking.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(booking.scheduledAt)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={updatingBookingId === booking.id}
                    onClick={() => updateBookingStatus(booking.id, "COMPLETED")}
                  >
                    {updatingBookingId === booking.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Mark Complete"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Jobs Table */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              All Assigned Jobs
            </h2>
            <p className="text-sm text-muted-foreground">
              Bookings loaded from{" "}
              <code className="text-xs">/api/technician/bookings</code>
            </p>
          </div>
          {isBookingsLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading bookings...
            </div>
          ) : (
            <BookingsTable
              bookings={myBookings}
              showTechnician={false}
              emptyMessage="No jobs assigned yet."
            />
          )}
        </section>
      </div>

      {/* Edit Profile Modal */}
      {isProfileModalOpen && profileDraft && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                Edit Technician Profile
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setProfileDraft(null);
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileDraft.name}
                    onChange={(e) =>
                      setProfileDraft((p) =>
                        p ? { ...p, name: e.target.value } : p,
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileDraft.phone}
                    onChange={(e) =>
                      setProfileDraft((p) =>
                        p ? { ...p, phone: e.target.value } : p,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceYrs">Experience (years)</Label>
                  <Input
                    id="experienceYrs"
                    type="number"
                    min={0}
                    value={profileDraft.experienceYrs}
                    onChange={(e) =>
                      setProfileDraft((p) =>
                        p ? { ...p, experienceYrs: Number(e.target.value) } : p,
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (৳)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min={0}
                    value={profileDraft.hourlyRate}
                    onChange={(e) =>
                      setProfileDraft((p) =>
                        p ? { ...p, hourlyRate: Number(e.target.value) } : p,
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileDraft.address}
                    onChange={(e) =>
                      setProfileDraft((p) =>
                        p ? { ...p, address: e.target.value } : p,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileDraft.city}
                    onChange={(e) =>
                      setProfileDraft((p) =>
                        p ? { ...p, city: e.target.value } : p,
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    setProfileDraft(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                Update Profile Picture
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setPhotoDraft("");
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={
                    photoDraft ||
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
                  value={photoDraft}
                  onChange={(e) => setPhotoDraft(e.target.value)}
                  placeholder="Enter image URL..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsPhotoModalOpen(false);
                    setPhotoDraft("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSavingPhoto}
                >
                  {isSavingPhoto ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Picture"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
