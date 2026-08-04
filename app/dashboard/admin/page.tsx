"use client";

import * as React from "react";
import {
  Users,
  Wrench,
  CalendarCheck2,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Camera,
  BarChart3,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingStatusChart } from "@/components/dashboard/BookingStatusChart";
import { CategoryShareChart } from "@/components/dashboard/CategoryShareChart";
import { BookingTrendsChart } from "@/components/dashboard/BookingTrendsChart";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import {
  MOCK_USERS,
  MOCK_TECHNICIANS,
  MOCK_SERVICE_CATEGORIES,
  MOCK_BOOKINGS,
  MOCK_REVENUE_DATA,
  getTechnicianName,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import type {
  ServiceCategory,
  User,
  Booking,
  RevenueDataPoint,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createAdminCategoryAction,
  getAdminCategoriesAction,
  getAdminUsersAction,
  updateAdminUserStatusAction,
  getAdminBookingsAction,
  type CreateCategoryServiceInput,
  getAllTechnicians,
} from "@/lib/adminAction";
import { getMyProfileAction } from "@/lib/profileAction";

type AdminTab = "overview" | "users" | "technicians" | "services" | "bookings";
type ChartFilter = "all" | "revenue" | "status" | "categories" | "trends";

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<AdminTab>("overview");
  const [chartFilter, setChartFilter] = React.useState<ChartFilter>("all");

  // Pagination States
  const [usersPage, setUsersPage] = React.useState(1);
  const [categoriesPage, setCategoriesPage] = React.useState(1);
  const [bookingsPage, setBookingsPage] = React.useState(1);

  // Admin Profile Photo State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = React.useState("");

  // Category Creation Form State (Supporting nested services array)
  const [catName, setCatName] = React.useState("");
  const [catDescription, setCatDescription] = React.useState("");
  const [serviceSubItems, setServiceSubItems] = React.useState<
    CreateCategoryServiceInput[]
  >([{ name: "", price: 1000, technicianId: "" }]);
  const [isCatSubmitting, setIsCatSubmitting] = React.useState(false);

  // Updating User Status loading state
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(
    null,
  );

  // 1. Fetch Logged-in Admin Profile
  const { data: myProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await getMyProfileAction();
      return res.success ? res.data : null;
    },
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  const adminUser =
    myProfile || MOCK_USERS.find((u) => u.role === "ADMIN") || MOCK_USERS[0];

  // 2. Fetch Admin Categories with Pagination
  const {
    data: categoriesRes,
    isLoading: isCatLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["adminCategories", categoriesPage],
    queryFn: () => getAdminCategoriesAction(categoriesPage, 10),
    staleTime: 1000 * 30,
  });

  const rawCategories = Array.isArray(categoriesRes?.data?.services)
    ? categoriesRes?.data?.services
    : categoriesRes?.data?.categories || categoriesRes?.data?.result || [];
  const categoriesList: ServiceCategory[] = rawCategories;
  const catMeta = categoriesRes?.meta || {
    page: 1,
    limit: 10,
    total: categoriesList.length,
    totalPages: 1,
  };

  // 3. Fetch Admin Users with Pagination
  const {
    data: usersRes,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["adminUsers", usersPage],
    queryFn: () => getAdminUsersAction(usersPage, 10),
    staleTime: 1000 * 30,
  });

  const rawUsers = usersRes?.data || [];
  const usersList: User[] = usersRes?.data?.Alluser ?? [];
  const usersMeta = usersRes?.meta || {
    page: 1,
    limit: 2,
    total: usersList.length,
    totalPages: 1,
  };

  const { data: techniciansRes, isLoading } = useQuery({
    queryKey: ["technicians"],
    queryFn: getAllTechnicians,
  });

  const technicians = techniciansRes?.data?.users ?? [];

  // 4. Fetch Admin Bookings for Dynamic Charts & Tables
  const {
    data: bookingsRes,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["adminBookings", bookingsPage],
    queryFn: () => getAdminBookingsAction(bookingsPage, 10),
    staleTime: 1000 * 30,
  });

  console.log(bookingsRes?.data.Allbooking);

  const rawBookings = bookingsRes?.data.Allbooking || [];
  const bookingsList: Booking[] =
    rawBookings.length > 0 ? rawBookings : MOCK_BOOKINGS;

  // Derived Dynamic Analytics from API Bookings
  const totalRevenue = bookingsList
    .filter((b) => b.status === "COMPLETED")
    .reduce(
      (sum, b) =>
        sum +
        (typeof b.totalAmount === "number"
          ? b.totalAmount
          : parseFloat(b.totalAmount as any) || 0),
      0,
    );

  const pendingBookings = bookingsList.filter(
    (b) => b.status === "PENDING",
  ).length;
  const completedBookings = bookingsList.filter(
    (b) => b.status === "COMPLETED",
  ).length;
  const customersCount = usersList.filter((u) => u.role === "CUSTOMER").length;

  // Dynamic Monthly Revenue Data for Charts
  const dynamicRevenueData: RevenueDataPoint[] = React.useMemo(() => {
    if (rawBookings.length === 0) return MOCK_REVENUE_DATA;

    const monthlyMap: Record<string, { revenue: number; bookings: number }> =
      {};
    const monthsOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    bookingsList.forEach((b) => {
      const d = new Date(b.createdAt || Date.now());
      const monthStr = monthsOrder[d.getMonth()] || "Jan";

      if (!monthlyMap[monthStr]) {
        monthlyMap[monthStr] = { revenue: 0, bookings: 0 };
      }
      monthlyMap[monthStr].bookings += 1;
      if (b.status === "COMPLETED") {
        monthlyMap[monthStr].revenue +=
          typeof b.totalAmount === "number"
            ? b.totalAmount
            : parseFloat(b.totalAmount as any) || 0;
      }
    });

    return monthsOrder
      .filter((m) => monthlyMap[m])
      .map((m) => ({
        month: m,
        revenue: monthlyMap[m].revenue,
        bookings: monthlyMap[m].bookings,
      }));
  }, [rawBookings, bookingsList]);

  // Handle Add/Remove Sub-Service items in Category Form
  const handleAddServiceSubItem = () => {
    setServiceSubItems((prev) => [
      ...prev,
      { name: "", price: 1000, technicianId: "" },
    ]);
  };

  const handleRemoveServiceSubItem = (index: number) => {
    setServiceSubItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleServiceSubItemChange = (
    index: number,
    field: keyof CreateCategoryServiceInput,
    value: any,
  ) => {
    setServiceSubItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // POST /api/admin/categories - Create Category (Admin Only)
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    // Validate and format sub-services array for Prisma backend createdCategory handler
    const validServices = serviceSubItems
      .filter(
        (s) => s.name.trim().length > 0 && s.technicianId.trim().length > 0,
      )
      .map((s) => ({
        name: s.name.trim(),
        price: Number(s.price) || 0,
        technicianId: s.technicianId.trim(),
        isActive: true,
      }));

    if (serviceSubItems.length > 0 && validServices.length === 0) {
      toast.error(
        "Please fill in Service Name and select a Technician for sub-services.",
      );
      return;
    }

    setIsCatSubmitting(true);
    const toastId = toast.loading("Creating category & services...");

    const res = await createAdminCategoryAction({
      name: catName.trim(),
      description: catDescription.trim(),
      services: validServices,
    });

    setIsCatSubmitting(false);

    if (res.success) {
      toast.success("Category & Services created successfully! 🎉", {
        id: toastId,
      });
      setCatName("");
      setCatDescription("");
      setServiceSubItems([{ name: "", price: 1000, technicianId: "" }]);
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      refetchCategories();
    } else {
      toast.error(res.error || "Failed to create category.", { id: toastId });
    }
  };

  // PATCH /api/admin/users/:userId - Update User Status
  const handleToggleUserStatus = async (user: User) => {
    const newStatus = !user.isActive;
    setUpdatingUserId(user.id);
    const toastId = toast.loading(`Updating status for ${user.name}...`);

    const res = await updateAdminUserStatusAction(user.id, {
      isActive: newStatus,
      status: newStatus ? "ACTIVE" : "INACTIVE",
    });

    setUpdatingUserId(null);

    if (res.success) {
      toast.success(
        `User ${user.name} is now ${newStatus ? "Active ✅" : "Blocked/Inactive 🚫"}`,
        { id: toastId },
      );
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      refetchUsers();
    } else {
      toast.error(res.error || "Failed to update user status.", {
        id: toastId,
      });
    }
  };

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "Overview & Analytics" },
    { id: "users", label: "Users Management" },
    { id: "technicians", label: "Technicians" },
    { id: "services", label: "Service Categories" },
    { id: "bookings", label: "Bookings" },
  ];

  return (
    <DashboardShell defaultRole="ADMIN">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage platform operations, users, categories, bookings, and live
              analytics.
            </p>
          </div>
        </div>

        {/* Admin Profile Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative group shrink-0">
                <img
                  src={
                    adminUser?.photoUrl ||
                    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80"
                  }
                  alt={adminUser?.name || "Admin Avatar"}
                  className="h-20 w-20 rounded-2xl border-2 border-primary/40 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewPhotoUrl(adminUser?.photoUrl ?? "");
                    setIsPhotoModalOpen(true);
                  }}
                  className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:scale-110"
                  title="Change Admin Profile Picture"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {adminUser?.name || "System Admin"}
                  </h2>
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    System Admin
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {adminUser?.email || "admin@fixitnow.com"}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {adminUser?.phone ?? "+880 1700-000099"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {formatDate(adminUser?.createdAt || "2025-06-01")}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewPhotoUrl(adminUser?.photoUrl ?? "");
                setIsPhotoModalOpen(true);
              }}
              className="gap-1.5"
            >
              <Camera className="h-3.5 w-3.5" />
              Edit Profile Picture
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/30 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards Driven by Real / Dynamic Data */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={isUsersLoading ? "..." : usersList.length}
                subtitle={`${customersCount} customers registered`}
                icon={Users}
              />
              <StatCard
                title="Technicians"
                value={isLoading ? "..." : technicians.length}
                subtitle={`${technicians.filter((t: any) => t.technicianProfile?.isVerified ?? t.isVerified).length} verified`}
                icon={Wrench}
              />
              <StatCard
                title="Total Bookings"
                value={isBookingsLoading ? "..." : bookingsList.length}
                subtitle={`${pendingBookings} pending`}
                icon={CalendarCheck2}
              />
              <StatCard
                title="Total Revenue"
                value={isBookingsLoading ? "..." : formatCurrency(totalRevenue)}
                subtitle="From completed bookings"
                icon={DollarSign}
                trend={{ value: "+12.5% vs last month", positive: true }}
              />
            </div>

            {/* MULTI-CHART SECTION */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Platform Analytics & Live Charts
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Dynamic visualization of revenue, booking statuses, service
                    categories, and volume trends.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/20 p-1 text-xs">
                  {(
                    [
                      "all",
                      "revenue",
                      "status",
                      "categories",
                      "trends",
                    ] as ChartFilter[]
                  ).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setChartFilter(filter)}
                      className={`rounded-md px-3 py-1.5 font-semibold capitalize transition-colors ${
                        chartFilter === filter
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {filter === "all" ? "All Charts" : filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHARTS GRID */}
              <div className="grid gap-6 lg:grid-cols-2">
                {(chartFilter === "all" || chartFilter === "revenue") && (
                  <RevenueChart data={dynamicRevenueData} />
                )}
                {(chartFilter === "all" || chartFilter === "status") && (
                  <BookingStatusChart bookings={bookingsList} />
                )}
                {(chartFilter === "all" || chartFilter === "categories") && (
                  <CategoryShareChart
                    categories={categoriesList}
                    bookings={bookingsList}
                  />
                )}
                {(chartFilter === "all" || chartFilter === "trends") && (
                  <BookingTrendsChart data={dynamicRevenueData} />
                )}
              </div>
            </div>

            {/* Recent Bookings Table */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">
                Recent Platform Bookings
              </h2>
              <BookingsTable bookings={bookingsList.slice(0, 5)} />
            </section>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT (/api/admin/users) */}
        {activeTab === "users" && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Users Management
                </h2>
                <p className="text-xs text-muted-foreground">
                  View registered users and update individual user status
                </p>
              </div>

              {/* Pagination Meta indicator */}
              <div className="text-xs text-muted-foreground font-medium">
                Showing {usersList.length} users (Page {usersMeta.page} of{" "}
                {usersMeta.totalPages})
              </div>
            </div>

            {isUsersLoading ? (
              <div className="flex items-center justify-center py-16 rounded-2xl border border-border bg-card">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-3.5 font-semibold">User</th>
                        <th className="px-4 py-3.5 font-semibold">User ID</th>
                        <th className="px-4 py-3.5 font-semibold">Email</th>
                        <th className="px-4 py-3.5 font-semibold">Phone</th>
                        <th className="px-4 py-3.5 font-semibold">Role</th>
                        <th className="px-4 py-3.5 font-semibold">Status</th>
                        <th className="px-4 py-3.5 font-semibold">Joined</th>
                        <th className="px-4 py-3.5 font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {usersList.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  user.photoUrl ||
                                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop"
                                }
                                alt={user.name}
                                className="h-9 w-9 rounded-full border border-border object-cover shrink-0"
                              />
                              <span className="font-semibold text-foreground">
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground truncate max-w-[120px]">
                            {user.id}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {user.phone ?? "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                user.isActive
                                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                                  : "bg-red-500/15 text-red-600 border border-red-500/30"
                              }`}
                            >
                              {user.isActive ? "Active" : "Blocked / Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <Button
                              size="sm"
                              variant={user.isActive ? "outline" : "default"}
                              disabled={updatingUserId === user.id}
                              onClick={() => handleToggleUserStatus(user)}
                              className="h-8 gap-1.5 text-xs rounded-lg"
                            >
                              {updatingUserId === user.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : user.isActive ? (
                                <>
                                  <UserX className="w-3.5 h-3.5 text-destructive" />
                                  Block User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Activate
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Page {usersMeta.page} of {usersMeta.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                      className="gap-1 text-xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={usersPage >= usersMeta.totalPages}
                      onClick={() => setUsersPage((p) => p + 1)}
                      className="gap-1 text-xs"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* TAB 3: TECHNICIANS */}
        {activeTab === "technicians" && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Technician Profiles ({technicians.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  All real technician profiles registered in the system.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16 rounded-2xl border border-border bg-card">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : technicians.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {technicians.map((tech: any) => {
                  const profile = tech.technicianProfile || tech;
                  const name = tech.name || tech.user?.name || "Technician";
                  const email = tech.email || tech.user?.email || "—";
                  const phone = tech.phone || tech.user?.phone || "—";
                  const photo =
                    tech.photoUrl ||
                    tech.photo ||
                    tech.user?.photoUrl ||
                    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop";
                  const exp = profile?.experienceYrs ?? 0;
                  const rate = profile?.hourlyRate ?? 0;
                  const city = profile?.city || "—";
                  const address = profile?.address || "—";
                  const isAvail = profile?.isAvailable ?? true;
                  const isVer = profile?.isVerified ?? false;

                  return (
                    <div
                      key={tech.id || tech.email}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={photo}
                          alt={name}
                          className="h-14 w-14 rounded-xl border border-border object-cover shrink-0 shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-foreground truncate">
                              {name}
                            </h3>
                            {isVer && (
                              <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {email}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-primary">
                            {city}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span className="font-semibold text-foreground">
                            {phone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-semibold text-foreground">
                            {exp} yrs
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hourly Rate:</span>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(Number(rate))}/hr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Address:</span>
                          <span className="font-semibold text-foreground truncate max-w-[150px]">
                            {address}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span
                            className={
                              isAvail
                                ? "text-emerald-600 font-bold"
                                : "text-amber-600 font-bold"
                            }
                          >
                            {isAvail ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground text-sm">
                No real technician profiles found in the database.
              </div>
            )}
          </section>
        )}

        {/* TAB 4: SERVICE CATEGORIES & CREATION (/api/admin/categories) */}
        {activeTab === "services" && (
          <div className="space-y-8">
            {/* Create Category Form with Array of Sub-Services */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Create Category & Services
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Only Admin can create categories and assign sub-services to
                  technicians.
                </p>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Category Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="catName">Category Name *</Label>
                    <Input
                      id="catName"
                      required
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="e.g. Moving Service1"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="catDesc">Description</Label>
                    <Input
                      id="catDesc"
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                      placeholder="e.g. Home and office relocation services"
                    />
                  </div>
                </div>

                {/* Nested Services Sub-Form */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Sub-Services Array
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddServiceSubItem}
                      className="h-8 gap-1 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Service Item
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {serviceSubItems.map((svc, idx) => (
                      <div
                        key={idx}
                        className="grid gap-3 sm:grid-cols-3 items-center rounded-xl border border-border bg-muted/30 p-3 relative"
                      >
                        {/* Service Name */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Service #{idx + 1} Name
                          </span>
                          <Input
                            required
                            value={svc.name}
                            onChange={(e) =>
                              handleServiceSubItemChange(
                                idx,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Apartment Moving1"
                            className="h-9 text-xs"
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Price (৳)
                          </span>
                          <Input
                            type="number"
                            min={0}
                            required
                            value={svc.price}
                            onChange={(e) =>
                              handleServiceSubItemChange(
                                idx,
                                "price",
                                Number(e.target.value),
                              )
                            }
                            className="h-9 text-xs"
                          />
                        </div>

                        {/* Technician ID */}
                        <div className="space-y-1 flex items-center gap-2">
                          <div className="flex-1">
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              Technician
                            </span>
                            <select
                              value={svc.technicianId}
                              onChange={(e) =>
                                handleServiceSubItemChange(
                                  idx,
                                  "technicianId",
                                  e.target.value,
                                )
                              }
                              className="flex h-9 w-full text-black rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                            >
                              <option value="">Select Technician</option>
                              {technicians.map((t: any) => {
                                const techId =
                                  t.technicianProfile?.id ||
                                  t.technicianProfileId ||
                                  t.id;
                                return (
                                  <option key={t.id} value={techId}>
                                    {t.name} ({techId.slice(0, 8)}...)
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {serviceSubItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveServiceSubItem(idx)}
                              className="mt-4 rounded-lg p-2 text-destructive hover:bg-destructive/10 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isCatSubmitting}
                    className="gap-2"
                  >
                    {isCatSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Creating
                        Category...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Create Category
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Service Categories Table & List */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-bold text-foreground">
                  Existing Categories & Services
                </h2>
                <div className="text-xs text-muted-foreground font-medium">
                  Page {catMeta.page} of {catMeta.totalPages} ({catMeta.total}{" "}
                  categories)
                </div>
              </div>

              {isCatLoading ? (
                <div className="flex items-center justify-center py-16 rounded-2xl border border-border bg-card">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {categoriesList.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-bold text-foreground">
                              {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {category.description ||
                                "No description provided."}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            {category.services?.length || 0} Services
                          </span>
                        </div>

                        {category.services && category.services.length > 0 ? (
                          <div className="overflow-x-auto rounded-xl border border-border">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                  <th className="px-4 py-2.5 font-semibold">
                                    Service Name
                                  </th>
                                  <th className="px-4 py-2.5 font-semibold">
                                    Price
                                  </th>
                                  <th className="px-4 py-2.5 font-semibold">
                                    Assigned Technician
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {category.services.map((service, idx) => (
                                  <tr key={service.id || idx}>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                      {service.name}
                                    </td>
                                    <td className="px-4 py-3 text-foreground font-semibold">
                                      {formatCurrency(service.price)}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                      {service.technician?.user?.name ||
                                        getTechnicianName(
                                          service.technicianId || "",
                                        ) ||
                                        service.technicianId ||
                                        "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">
                            No services attached to this category yet.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Categories Pagination */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Page {catMeta.page} of {catMeta.totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={categoriesPage <= 1}
                        onClick={() =>
                          setCategoriesPage((p) => Math.max(1, p - 1))
                        }
                        className="gap-1 text-xs"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={categoriesPage >= catMeta.totalPages}
                        onClick={() => setCategoriesPage((p) => p + 1)}
                        className="gap-1 text-xs"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {/* TAB 5: BOOKINGS (/api/admin/bookings) */}
        {activeTab === "bookings" && (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  All Platform Bookings
                </h2>
                <p className="text-xs text-muted-foreground">
                  Full booking records with customer, technician, service, and
                  payment details.
                </p>
              </div>
              <div className="flex gap-2 text-xs font-semibold">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-600 border border-amber-500/30">
                  {pendingBookings} Pending
                </span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-600 border border-emerald-500/30">
                  {completedBookings} Completed
                </span>
              </div>
            </div>

            {isBookingsLoading ? (
              <div className="flex items-center justify-center py-16 rounded-2xl border border-border bg-card">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : (
              <BookingsTable bookings={bookingsList} />
            )}
          </section>
        )}

        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  Update Admin Profile Picture
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPhotoUrl.trim()) {
                    setIsPhotoModalOpen(false);
                    toast.success("Admin picture updated!");
                  }
                }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <img
                    src={
                      newPhotoUrl ||
                      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80"
                    }
                    alt="Admin Avatar Preview"
                    className="h-28 w-28 rounded-2xl border-2 border-primary object-cover shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPhotoUrl">Photo URL</Label>
                  <Input
                    id="adminPhotoUrl"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Enter avatar image URL..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsPhotoModalOpen(false)}
                  >
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
      </div>
    </DashboardShell>
  );
}
