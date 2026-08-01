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
} from "lucide-react";
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
import type { ServiceCategory, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminTab = "overview" | "users" | "technicians" | "services" | "bookings";
type ChartFilter = "all" | "revenue" | "status" | "categories" | "trends";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<AdminTab>("overview");
  const [chartFilter, setChartFilter] = React.useState<ChartFilter>("all");
  const [categories, setCategories] = React.useState<ServiceCategory[]>(MOCK_SERVICE_CATEGORIES);
  const [usersList, setUsersList] = React.useState<User[]>(MOCK_USERS);
  const [successMessage, setSuccessMessage] = React.useState("");

  // Admin User & Photo State
  const initialAdmin = usersList.find((u) => u.role === "ADMIN") ?? usersList[3];
  const [adminUser, setAdminUser] = React.useState<User>(initialAdmin);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = React.useState(adminUser?.photoUrl ?? "");

  const [newCategory, setNewCategory] = React.useState({ name: "", description: "" });
  const [newService, setNewService] = React.useState({
    categoryId: "",
    name: "",
    price: 0,
    technicianId: "",
  });

  const customers = usersList.filter((u) => u.role === "CUSTOMER");
  const totalRevenue = MOCK_BOOKINGS.filter((b) => b.status === "COMPLETED").reduce(
    (sum, b) => sum + b.totalAmount,
    0,
  );
  const pendingBookings = MOCK_BOOKINGS.filter((b) => b.status === "PENDING").length;

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "Overview & Analytics" },
    { id: "users", label: "Users" },
    { id: "technicians", label: "Technicians" },
    { id: "services", label: "Services" },
    { id: "bookings", label: "Bookings" },
  ];

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleUpdateAdminPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const updated = { ...adminUser, photoUrl: newPhotoUrl.trim() };
    setAdminUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setIsPhotoModalOpen(false);
    showSuccess("Admin profile picture updated successfully.");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const category: ServiceCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      services: [],
    };
    setCategories((prev) => [...prev, category]);
    setNewCategory({ name: "", description: "" });
    showSuccess(`Category "${category.name}" added successfully.`);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.categoryId || !newService.name.trim() || !newService.technicianId) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === newService.categoryId
          ? {
              ...cat,
              services: [
                ...cat.services,
                {
                  id: `svc-${Date.now()}`,
                  name: newService.name,
                  price: newService.price,
                  technicianId: newService.technicianId,
                },
              ],
            }
          : cat,
      ),
    );
    setNewService({ categoryId: "", name: "", price: 0, technicianId: "" });
    showSuccess("Service added successfully.");
  };

  const handleDeleteService = (categoryId: string, serviceId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, services: cat.services.filter((s) => s.id !== serviceId) }
          : cat,
      ),
    );
    showSuccess("Service removed.");
  };

  return (
    <DashboardShell defaultRole="ADMIN">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage platform operations, users, technicians, services, and multi-chart analytics.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Admin Profile Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Profile Pic with Edit Button */}
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
                  aria-label="Change Profile Picture"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{adminUser?.name}</h2>
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    System Admin
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{adminUser?.email}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {adminUser?.phone ?? "+880 1700-000099"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    System Active since {formatDate(adminUser?.createdAt || "2025-06-01")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview & Multi-Chart Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={customers.length}
                subtitle={`${usersList.length} total accounts`}
                icon={Users}
              />
              <StatCard
                title="Technicians"
                value={MOCK_TECHNICIANS.length}
                subtitle={`${MOCK_TECHNICIANS.filter((t) => t.isVerified).length} verified`}
                icon={Wrench}
              />
              <StatCard
                title="Total Bookings"
                value={MOCK_BOOKINGS.length}
                subtitle={`${pendingBookings} pending`}
                icon={CalendarCheck2}
              />
              <StatCard
                title="Revenue"
                value={formatCurrency(totalRevenue)}
                subtitle="From completed bookings"
                icon={DollarSign}
                trend={{ value: "+12.5% vs last month", positive: true }}
              />
            </div>

            {/* MULTI-CHART SECTION HEADER & FILTERS */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Platform Analytics & Charts
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive metric visualizations of earnings, booking statuses, service categories, and order trends.
                  </p>
                </div>

                {/* Chart Filter Buttons */}
                <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/20 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setChartFilter("all")}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                      chartFilter === "all"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All Charts
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartFilter("revenue")}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                      chartFilter === "revenue"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartFilter("status")}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                      chartFilter === "status"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Booking Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartFilter("categories")}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                      chartFilter === "categories"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Category Share
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartFilter("trends")}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                      chartFilter === "trends"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Volume Trends
                  </button>
                </div>
              </div>

              {/* CHARTS GRID */}
              <div className="grid gap-6 lg:grid-cols-2">
                {(chartFilter === "all" || chartFilter === "revenue") && (
                  <RevenueChart data={MOCK_REVENUE_DATA} />
                )}
                {(chartFilter === "all" || chartFilter === "status") && (
                  <BookingStatusChart bookings={MOCK_BOOKINGS} />
                )}
                {(chartFilter === "all" || chartFilter === "categories") && (
                  <CategoryShareChart categories={categories} bookings={MOCK_BOOKINGS} />
                )}
                {(chartFilter === "all" || chartFilter === "trends") && (
                  <BookingTrendsChart data={MOCK_REVENUE_DATA} />
                )}
              </div>
            </div>

            {/* Recent Bookings Table */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
              <BookingsTable bookings={MOCK_BOOKINGS.slice(0, 5)} />
            </section>
          </div>
        )}

        {/* Users Tab with Profile Pictures */}
        {activeTab === "users" && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Registered Users</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30">
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
                          <span className="font-semibold text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{user.phone ?? "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            user.isActive
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-red-500/15 text-red-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Technicians Tab with Profile Pictures */}
        {activeTab === "technicians" && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Technician Profiles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_TECHNICIANS.map((tech) => (
                <div
                  key={tech.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        tech.user?.photoUrl ||
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop"
                      }
                      alt={tech.user?.name ?? "Technician"}
                      className="h-14 w-14 rounded-xl border border-border object-cover shrink-0 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-foreground truncate">{tech.user?.name}</h3>
                        {tech.isVerified && (
                          <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{tech.user?.email}</p>
                      <p className="mt-1 text-xs font-semibold text-primary">{tech.city}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-semibold text-foreground">{tech.experienceYrs} yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hourly Rate:</span>
                      <span className="font-semibold text-foreground">{formatCurrency(tech.hourlyRate)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-semibold text-foreground">★ {tech.avgRating} ({tech.totalReviews} reviews)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={
                          tech.isAvailable ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"
                        }
                      >
                        {tech.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  <p className="truncate font-mono text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    ID: {tech.id}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-8">
            {/* Add Category Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                <Plus className="h-5 w-5" />
                Add Service Category
              </h2>
              <form onSubmit={handleAddCategory} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="catName">Category Name</Label>
                  <Input
                    id="catName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Moving Service"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catDesc">Description</Label>
                  <Input
                    id="catDesc"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="e.g. Home and office relocation services"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">Add Category</Button>
                </div>
              </form>
            </div>

            {/* Add Service Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                <Plus className="h-5 w-5" />
                Add Service to Category
              </h2>
              <form onSubmit={handleAddService} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="svcCategory">Category</Label>
                  <select
                    id="svcCategory"
                    value={newService.categoryId}
                    onChange={(e) =>
                      setNewService((p) => ({ ...p, categoryId: e.target.value }))
                    }
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="svcName">Service Name</Label>
                  <Input
                    id="svcName"
                    value={newService.name}
                    onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Apartment Moving"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="svcPrice">Price (৳)</Label>
                  <Input
                    id="svcPrice"
                    type="number"
                    min={0}
                    value={newService.price || ""}
                    onChange={(e) =>
                      setNewService((p) => ({ ...p, price: Number(e.target.value) }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="svcTech">Technician</Label>
                  <select
                    id="svcTech"
                    value={newService.technicianId}
                    onChange={(e) =>
                      setNewService((p) => ({ ...p, technicianId: e.target.value }))
                    }
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
                    required
                  >
                    <option value="">Select technician</option>
                    {MOCK_TECHNICIANS.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.user?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">Add Service</Button>
                </div>
              </form>
            </div>

            {/* Service Categories List */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Service Categories</h2>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  {category.services.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                          <tr>
                            <th className="px-4 py-2.5 font-semibold">Service</th>
                            <th className="px-4 py-2.5 font-semibold">Price</th>
                            <th className="px-4 py-2.5 font-semibold">Technician</th>
                            <th className="px-4 py-2.5 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {category.services.map((service) => (
                            <tr key={service.id}>
                              <td className="px-4 py-3 font-medium text-foreground">
                                {service.name}
                              </td>
                              <td className="px-4 py-3 text-foreground">
                                {formatCurrency(service.price)}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {getTechnicianName(service.technicianId)}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteService(category.id, service.id)}
                                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10"
                                  aria-label="Delete service"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No services in this category yet.</p>
                  )}
                </div>
              ))}
            </section>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">All Bookings</h2>
                <p className="text-sm text-muted-foreground">
                  Full booking records with customer, technician, service, and payment details.
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-bold text-amber-600">
                  {pendingBookings} Pending
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-bold text-emerald-600">
                  {MOCK_BOOKINGS.filter((b) => b.status === "COMPLETED").length} Completed
                </span>
              </div>
            </div>
            <BookingsTable bookings={MOCK_BOOKINGS} />
          </section>
        )}

        {/* Admin Profile Photo Modal */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Update Admin Profile Picture</h3>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateAdminPhoto} className="space-y-4">
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
      </div>
    </DashboardShell>
  );
}
