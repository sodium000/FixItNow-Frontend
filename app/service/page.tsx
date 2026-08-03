"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  Star,
  MapPin,
  Wrench,
  Sparkles,
  ArrowUpDown,
  UserCheck,
  Tag,
  Clock,
  ShieldCheck,
  ArrowRight,
  X,
  Command,
  Filter,
  RefreshCw,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES
// ============================================================================

export interface ApiCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  photoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTechnician {
  id: string;
  userId: string;
  experienceYrs: number;
  hourlyRate: string | number;
  isVerified: boolean;
  isAvailable: boolean;
  address?: string | null;
  city?: string | null;
  avgRating: number;
  totalReviews: number;
  createdAt?: string;
  updatedAt?: string;
  user?: ApiUser;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: string | number;
  categoryId: string;
  technicianId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ApiCategory;
  technician?: ApiTechnician;
  description?: string;
  estimatedDuration?: string;
  warrantyPeriod?: string;
  type?: string;
}

// ============================================================================
import { getServicesAction } from "./serviceAction";

const fetchServices = async (): Promise<ServiceItem[]> => {
  const result = await getServicesAction();
  if (!result.success) {
    throw new Error(result.error);
  }
  console.log(result);
  return result.data;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ServicesPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const cardsGridRef = React.useRef<HTMLDivElement>(null);
  const modalInputRef = React.useRef<HTMLInputElement>(null);

  // States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedCity, setSelectedCity] = React.useState("All");
  const [minRating, setMinRating] = React.useState<number>(0);
  const [sortByPrice, setSortByPrice] = React.useState<"none" | "asc" | "desc">(
    "none",
  );

  // TanStack Query to fetch and cache services
  const {
    data: servicesData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Extract dynamic categories from API response
  const dynamicCategories = React.useMemo(() => {
    const map = new Map<string, string>();
    map.set("all", "All Services");
    servicesData.forEach((item) => {
      if (item.category?.id && item.category?.name) {
        map.set(item.category.id, item.category.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [servicesData]);

  // Extract dynamic cities from API response
  const dynamicCities = React.useMemo(() => {
    const set = new Set<string>();
    servicesData.forEach((item) => {
      if (item.technician?.city) {
        set.add(item.technician.city);
      }
    });
    return Array.from(set);
  }, [servicesData]);

  // Keyboard Shortcut (Ctrl + K or Cmd + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus modal input on open
  React.useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => modalInputRef.current?.focus(), 50);
    }
  }, [isModalOpen]);

  // GSAP Animations
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        );
      }

      if (cardsGridRef.current) {
        gsap.fromTo(
          cardsGridRef.current.children,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out",
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [
    selectedCategory,
    searchQuery,
    selectedCity,
    minRating,
    sortByPrice,
    isLoading,
  ]);

  // Filter Services Logic
  const filteredServices = React.useMemo(() => {
    return servicesData
      .filter((item) => {
        if (item.isActive === false) return false;

        // Category Filter
        if (
          selectedCategory !== "all" &&
          item.categoryId !== selectedCategory &&
          item.category?.id !== selectedCategory
        ) {
          return false;
        }

        // Search Query Filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(q);
          const techNameMatch = item.technician?.user?.name
            ?.toLowerCase()
            .includes(q);
          const catNameMatch = item.category?.name?.toLowerCase().includes(q);
          if (!nameMatch && !techNameMatch && !catNameMatch) return false;
        }

        // City Filter
        if (selectedCity !== "All" && item.technician?.city !== selectedCity) {
          return false;
        }

        // Min Rating Filter
        if (minRating > 0 && (item.technician?.avgRating || 0) < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        if (sortByPrice === "asc") return priceA - priceB;
        if (sortByPrice === "desc") return priceB - priceA;
        return 0;
      });
  }, [
    servicesData,
    searchQuery,
    selectedCategory,
    selectedCity,
    minRating,
    sortByPrice,
  ]);

  // Quick Modal Search Results
  const modalResults = React.useMemo(() => {
    if (!modalSearch.trim()) return [];
    const q = modalSearch.toLowerCase();
    return servicesData
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.technician?.user?.name?.toLowerCase().includes(q) ||
          item.category?.name?.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [servicesData, modalSearch]);

  const handleSelectModalResult = (serviceName: string) => {
    setSearchQuery(serviceName);
    setIsModalOpen(false);
    setModalSearch("");
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-emerald-500/20 selection:text-gray-500 pt-32 pb-16 px-4 sm:px-6 lg:px-8 font-sans"
    >
      {/* Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(26,29,27,0.753),rgba(255,255,255,0))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.1)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div className="w-full mx-auto space-y-8 relative z-10">
        {/* HEADER SECTION */}
        <div
          ref={headerRef}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-gray-100 font-semibold text-xs tracking-wide">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Experts & Services</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-700 leading-tight">
            Book Professional <span className="text-slate-700">Services</span>
          </h1>

          {/* TRIGGER MODAL SEARCH BUTTON */}
          <div className="pt-2 max-w-md mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-slate-400 hover:text-white hover:border-emerald-500/50 shadow-lg backdrop-blur-md transition-all group"
            >
              <div className="flex items-center gap-2 text-xs">
                <Search className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Search services, technicians...</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT: ASIDE FILTERS + CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ASIDE SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span>Filters & Categories</span>
              </div>

              {(selectedCategory !== "all" ||
                selectedCity !== "All" ||
                minRating > 0 ||
                searchQuery !== "") && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedCity("All");
                    setMinRating(0);
                    setSearchQuery("");
                  }}
                  className="text-[10px] text-emerald-400 hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Category
              </label>
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                {dynamicCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-slate-700 text-white font-bold shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-950/50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City Dropdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> City Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-gray-400"
              >
                <option value="All">All Cities</option>
                {dynamicCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating Filter */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{" "}
                Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-gray-400"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>

            {/* Price Sort */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-emerald-400" /> Sort Price
              </label>
              <select
                value={sortByPrice}
                onChange={(e) =>
                  setSortByPrice(e.target.value as "none" | "asc" | "desc")
                }
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-gray-400"
              >
                <option value="none">Default Order</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 space-y-4">
            {/* Active Query Banner */}
            {searchQuery && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span>
                  Showing search results for:{" "}
                  <strong className="text-emerald-400">"{searchQuery}"</strong>
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Loading State Skeletons */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-3.5 space-y-3 animate-pulse"
                  >
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-slate-800 rounded-md" />
                      <div className="h-4 w-12 bg-slate-800 rounded-md" />
                    </div>
                    <div className="h-5 w-3/4 bg-slate-800 rounded-md" />
                    <div className="h-3 w-full bg-slate-800/60 rounded-md" />
                    <div className="h-12 bg-slate-950 rounded-xl" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 w-16 bg-slate-800 rounded-md" />
                      <div className="h-7 w-20 bg-slate-800 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              /* Error State */
              <div className="text-center py-16 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  Failed to Load Services
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {(error as Error)?.message ||
                    "Something went wrong while fetching services."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : filteredServices.length > 0 ? (
              /* Service Cards Grid */
              <div
                ref={cardsGridRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5"
              >
                {filteredServices.map((service) => {
                  const techName =
                    service.technician?.user?.name || "Verified Specialist";
                  const techCity =
                    service.technician?.city ||
                    service.technician?.address ||
                    "Available";
                  const techRating = service.technician?.avgRating ?? 4.8;
                  const techReviews = service.technician?.totalReviews;
                  const techExp = service.technician?.experienceYrs;

                  return (
                    <div
                      key={service.id}
                      className="group rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/40 p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 relative overflow-hidden backdrop-blur-md"
                    >
                      <div className="space-y-2.5">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-emerald-400 font-semibold text-[9px]">
                            {service.category?.name || "General Service"}
                          </span>

                          {service.technician?.isVerified && (
                            <span className="px-2 py-0.5 rounded-md font-semibold text-[9px] border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Desc */}
                        <div>
                          <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                            {service.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                            {service.category?.description ||
                              service.description ||
                              "Professional service provided by background-checked experts."}
                          </p>
                        </div>

                        {/* Experience & Rate info */}
                        <div className="grid grid-cols-2 gap-1 pt-0.5">
                          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/60 flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                            <span className="text-[9px] font-semibold text-slate-300 truncate">
                              {techExp ? `${techExp} Yrs Exp` : "Expert Tech"}
                            </span>
                          </div>

                          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/60 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span className="text-[9px] font-semibold text-slate-300 truncate">
                              {service.technician?.hourlyRate
                                ? `$${service.technician.hourlyRate}/hr`
                                : "Flexible"}
                            </span>
                          </div>
                        </div>

                        {/* Technician Profile Card */}
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold text-[9px] shrink-0">
                              <UserCheck className="w-3 h-3" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-white truncate">
                                {techName}
                              </p>
                              <p className="text-[8px] text-slate-400 flex items-center gap-0.5 truncate">
                                <MapPin className="w-2 h-2 text-slate-500 shrink-0" />
                                <span className="truncate">{techCity}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            <span className="text-[9px] font-bold text-white">
                              {techRating}
                            </span>
                            {techReviews !== undefined && techReviews > 0 && (
                              <span className="text-[7px] text-slate-400">
                                ({techReviews})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Price & Action */}
                      <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1">
                        <div>
                          <span className="text-[8px] text-slate-500 block uppercase font-semibold">
                            Service Price
                          </span>
                          <span className="text-sm font-extrabold text-white">
                            ${Number(service.price).toLocaleString()}
                          </span>
                        </div>

                        <Link href={`/booking?serviceId=${service.id}`}>
                          <button
                            type="button"
                            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-lg text-[11px] transition-all duration-150 active:scale-95 flex items-center gap-1 shadow-sm"
                          >
                            <span>Book</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Results State */
              <div className="text-center py-16 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <Sparkles className="w-6 h-6 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">
                  No Services Found
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Try adjusting your filter or search criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* INTERACTIVE SEARCH MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Input Box */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                ref={modalInputRef}
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Search services or technicians..."
                className="w-full bg-transparent text-white text-sm placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Results List */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              {modalSearch.trim() === "" ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Start typing to search for services or experts...
                </div>
              ) : modalResults.length > 0 ? (
                modalResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectModalResult(item.name)}
                    className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.category?.name || "General"} •{" "}
                        {item.technician?.user?.name || "Technician"} (
                        {item.technician?.city || "Location"})
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">
                      ${Number(item.price).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No matching services found for "{modalSearch}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>
                Press{" "}
                <kbd className="px-1 bg-slate-800 rounded text-slate-300">
                  ESC
                </kbd>{" "}
                to exit
              </span>
              <span className="text-emerald-400 font-semibold">
                Interactive Search
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
