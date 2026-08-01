"use client";

import * as React from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Wrench,
  Star,
  MapPin,
  Clock,
  DollarSign,
  X,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Building,
  Briefcase,
  ChevronRight,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type BookingStatus = "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";

export interface BookingData {
  id: string;
  serviceTitle: string;
  customerName?: string;
  technicianName?: string;
  date: string;
  amount: number;
  status: BookingStatus;
}

export interface TechnicianProfileData {
  id: string;
  userId: string;
  experienceYrs: number;
  hourlyRate: number;
  isVerified: boolean;
  isAvailable: boolean;
  address?: string;
  city?: string;
  avgRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  bookingsAsTechnician?: BookingData[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  technicianProfile?: TechnicianProfileData | null;
  bookingsAsCustomer?: BookingData[];
  _count?: {
    bookingsAsCustomer: number;
    reviewsWritten: number;
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CUSTOMER_BOOKINGS: BookingData[] = [
  {
    id: "bk-101",
    serviceTitle: "AC Repair & Servicing",
    technicianName: "Tanvir Ahmed",
    date: "2026-05-12T10:00:00Z",
    amount: 45.0,
    status: "COMPLETED",
  },
  {
    id: "bk-102",
    serviceTitle: "Electrical Wiring Check",
    technicianName: "Kazi Nabil",
    date: "2026-05-18T14:30:00Z",
    amount: 30.0,
    status: "ACCEPTED",
  },
];

const MOCK_TECHNICIAN_BOOKINGS: BookingData[] = [
  {
    id: "bk-201",
    serviceTitle: "Plumbing Leak Fix",
    customerName: "Mahmud Hasan",
    date: "2026-05-20T11:00:00Z",
    amount: 50.0,
    status: "PENDING",
  },
  {
    id: "bk-202",
    serviceTitle: "Kitchen Sink Repair",
    customerName: "Sumi Rahman",
    date: "2026-05-15T16:00:00Z",
    amount: 35.0,
    status: "COMPLETED",
  },
];

const MOCK_USER: UserData = {
  id: "usr-98234-x89",
  name: "Raisul Islam",
  email: "raisul@example.com",
  phone: "+880 1700-000000",
  role: "CUSTOMER",
  isActive: true,
  photoUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  createdAt: "2025-11-15T08:30:00.000Z",
  updatedAt: "2026-05-10T14:20:00.000Z",
  bookingsAsCustomer: MOCK_CUSTOMER_BOOKINGS,
  technicianProfile: {
    id: "tech-771",
    userId: "usr-98234-x89",
    experienceYrs: 3,
    hourlyRate: 35.0,
    isVerified: true,
    isAvailable: true,
    address: "Shantiniketon",
    city: "Dhaka",
    avgRating: 4.8,
    totalReviews: 14,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-05-10T00:00:00Z",
    bookingsAsTechnician: MOCK_TECHNICIAN_BOOKINGS,
  },
  _count: {
    bookingsAsCustomer: 2,
    reviewsWritten: 5,
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProfilePage() {
  const [user, setUser] = React.useState<UserData>(MOCK_USER);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<"CUSTOMER" | "TECHNICIAN">(
    "CUSTOMER",
  );

  const [techFormData, setTechFormData] = React.useState({
    experienceYrs: 1,
    hourlyRate: 25.0,
    address: "",
    city: "",
  });

  const handleTechFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTechFormData((prev) => ({
      ...prev,
      [name]:
        name === "experienceYrs" || name === "hourlyRate"
          ? Number(value)
          : value,
    }));
  };

  const handleBecomeTechnicianSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProfile: TechnicianProfileData = {
      id: `tech-${Date.now()}`,
      userId: user.id,
      experienceYrs: techFormData.experienceYrs,
      hourlyRate: techFormData.hourlyRate,
      isVerified: false,
      isAvailable: true,
      address: techFormData.address,
      city: techFormData.city,
      avgRating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookingsAsTechnician: [],
    };

    setUser((prev) => ({
      ...prev,
      role: "TECHNICIAN",
      technicianProfile: newProfile,
    }));

    setIsModalOpen(false);
    setSuccessMessage("Technician profile created successfully!");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const currentBookings =
    activeTab === "CUSTOMER"
      ? user.bookingsAsCustomer || []
      : user.technicianProfile?.bookingsAsTechnician || [];

  return (
    <div className="relative min-h-screen text-neutral-100 selection:bg-yellow-400/30 selection:text-yellow-300 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-yellow-400" />
            <span className="text-xs font-semibold">{successMessage}</span>
          </div>
        )}

        {/* PROFILE HEADER CARD */}
        <div className="bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-yellow-400/40 shadow-lg"
              />
              <span
                className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  user.isActive
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-xs text-neutral-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5 text-yellow-400" />
                    {user.email}
                  </p>
                </div>

                <div className="flex items-center justify-center sm:justify-end gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-950 border border-neutral-800 text-yellow-400 uppercase tracking-wider">
                    {user.role}
                  </span>

                  {!user.technicianProfile && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-yellow-400/10 active:scale-95 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Become a Technician
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-xs text-neutral-300">
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{user.phone || "No phone number added"}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">
                Customer Bookings
              </p>
              <h3 className="text-xl font-bold text-white">
                {user.bookingsAsCustomer?.length || 0} Orders
              </h3>
            </div>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">
                Technician Jobs
              </p>
              <h3 className="text-xl font-bold text-white">
                {user.technicianProfile?.bookingsAsTechnician?.length || 0} Jobs
              </h3>
            </div>
          </div>
        </div>

        {/* BOOKINGS MANAGEMENT TABLE WITH TAB TOGGLE */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">
                Booking History
              </h2>
              <p className="text-xs text-neutral-400">
                Manage your orders and assigned technician service requests.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveTab("CUSTOMER")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "CUSTOMER"
                    ? "bg-yellow-400 text-neutral-950 shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                My Orders ({user.bookingsAsCustomer?.length || 0})
              </button>

              {user.technicianProfile && (
                <button
                  onClick={() => setActiveTab("TECHNICIAN")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "TECHNICIAN"
                      ? "bg-yellow-400 text-neutral-950 shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  My Jobs (
                  {user.technicianProfile.bookingsAsTechnician?.length || 0})
                </button>
              )}
            </div>
          </div>

          {/* Bookings Table */}
          {currentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Service</th>
                    <th className="px-4 py-3">
                      {activeTab === "CUSTOMER" ? "Technician" : "Customer"}
                    </th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {currentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold text-white">
                        {booking.serviceTitle}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-400">
                        {activeTab === "CUSTOMER"
                          ? booking.technicianName || "Unassigned"
                          : booking.customerName || "Unknown"}
                      </td>
                      <td className="px-4 py-3.5">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-yellow-400">
                        ${booking.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            booking.status === "COMPLETED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : booking.status === "ACCEPTED"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No bookings found for this role.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
