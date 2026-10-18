/* eslint-disable react/no-unescaped-entities */
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
  Clock,
  ShieldCheck,
  ArrowRight,
  X,
  Command,
  Filter,
  RefreshCw,
  AlertCircle,
  Briefcase,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

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
  image?: string | null;
  imageUrl?: string | null;
}

// ============================================================================
import { getServicesAction } from "./serviceAction";

const fetchServices = async (): Promise<ServiceItem[]> => {
  const result = await getServicesAction();
  if (!result.success) {
    throw new Error(result.error);
  }
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [recommendationQuery, setRecommendationQuery] = React.useState("");
  const [recommendationReason, setRecommendationReason] = React.useState("");
  const [recommendationError, setRecommendationError] = React.useState("");
  const [recommendedIds, setRecommendedIds] = React.useState<string[]>([]);
  const [isRecommending, setIsRecommending] = React.useState(false);
  const [navigatingId, setNavigatingId] = React.useState<string | null>(null);
  const pageSize = 8;

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
    if (selectedCity !== "All") set.add(selectedCity);
    return Array.from(set);
  }, [servicesData, selectedCity]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    const city = params.get("city");
    if (search) setSearchQuery(search);
    if (city) setSelectedCity(city);
  }, []);

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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCity, minRating, sortByPrice]);

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
        const recommendationA = recommendedIds.indexOf(a.id);
        const recommendationB = recommendedIds.indexOf(b.id);
        if (recommendationA !== -1 || recommendationB !== -1) {
          if (recommendationA === -1) return 1;
          if (recommendationB === -1) return -1;
          if (recommendationA !== recommendationB) {
            return recommendationA - recommendationB;
          }
        }
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
    recommendedIds,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const pageServices = filteredServices.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  const getRecommendations = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = recommendationQuery.trim();
    if (!query) {
      setRecommendationError("Describe the repair or service you need.");
      return;
    }

    setIsRecommending(true);
    setRecommendationError("");
    setRecommendationReason("");
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          services: servicesData.slice(0, 30).map((service) => ({
            id: service.id,
            name: service.name,
            category: service.category?.name || "Home service",
            description: service.description || service.category?.description || "",
          })),
        }),
      });
      const result: {
        serviceIds?: string[];
        reason?: string;
        error?: string;
      } = await response.json();
      if (!response.ok || !result.serviceIds) {
        throw new Error(result.error || "Could not get service suggestions.");
      }
      setRecommendedIds(result.serviceIds);
      setRecommendationReason(result.reason || "Recommended matches are shown first.");
      setCurrentPage(1);
    } catch (caught) {
      setRecommendationError(
        caught instanceof Error
          ? caught.message
          : "Could not get service suggestions.",
      );
    } finally {
      setIsRecommending(false);
    }
  };

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
      className="relative min-h-screen overflow-hidden bg-background text-foreground pt-32 pb-16 px-4 sm:px-6 lg:px-8 font-sans"
    >
      {/* Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,120,120,0.08),transparent)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div className="w-full mx-auto space-y-8 relative z-10">
        {/* HEADER SECTION */}
        <div
          ref={headerRef}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wide">
            <Wrench className="w-3.5 h-3.5" />
            <span>Verified Experts & Services</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Book Professional <span className="text-primary">Services</span>
          </h1>

          {/* TRIGGER MODAL SEARCH BUTTON */}
          <div className="pt-2 max-w-md mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 shadow-sm backdrop-blur-md transition-all group"
            >
              <div className="flex items-center gap-2 text-xs">
                <Search className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Search services, technicians...</span>
              </div>
              <div className="flex items-center gap-1 bg-muted border border-border px-2 py-0.5 rounded text-[10px] text-muted-foreground font-mono">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>
          <form
            onSubmit={getRecommendations}
            className="mx-auto mt-3 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-3 text-left shadow-sm sm:flex-row"
          >
            <label className="sr-only" htmlFor="service-recommendation-query">
              Describe the home service you need
            </label>
            <input
              id="service-recommendation-query"
              value={recommendationQuery}
              onChange={(event) => setRecommendationQuery(event.target.value)}
              maxLength={500}
              placeholder="Describe the repair you need for AI suggestions"
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={isRecommending || isLoading || servicesData.length === 0}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRecommending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isRecommending ? "Finding matches…" : "Suggest services"}
            </button>
          </form>
          {recommendationError && (
            <p role="alert" className="mx-auto max-w-2xl text-left text-sm text-destructive">
              {recommendationError}
            </p>
          )}
          {recommendationReason && (
            <p className="mx-auto max-w-2xl text-left text-sm text-muted-foreground">
              {recommendationReason}{" "}
              <button
                type="button"
                onClick={() => {
                  setRecommendedIds([]);
                  setRecommendationReason("");
                }}
                className="font-semibold text-primary underline underline-offset-2"
              >
                Clear suggestions
              </button>
            </p>
          )}
        </div>

        {/* MAIN LAYOUT: ASIDE FILTERS + CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ASIDE SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 bg-card border border-border p-4 rounded-2xl shadow-sm backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <Filter className="w-4 h-4 text-primary" />
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
                  className="text-[10px] text-primary hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
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
                          ? "bg-primary text-primary-foreground font-bold shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City Dropdown */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" /> City Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-background border border-border text-foreground text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-primary"
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
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />{" "}
                Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full bg-background border border-border text-foreground text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-primary"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>

            {/* Price Sort */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-primary" /> Sort Price
              </label>
              <select
                value={sortByPrice}
                onChange={(e) =>
                  setSortByPrice(e.target.value as "none" | "asc" | "desc")
                }
                className="w-full bg-background border border-border text-foreground text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-primary"
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
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-xs text-foreground">
                <span>
                  Showing search results for:{" "}
                  <strong className="text-primary">"{searchQuery}"</strong>
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground p-1"
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
                    className="rounded-2xl bg-card border border-border p-3.5 space-y-3 animate-pulse"
                  >
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-muted rounded-md" />
                      <div className="h-4 w-12 bg-muted rounded-md" />
                    </div>
                    <div className="h-5 w-3/4 bg-muted rounded-md" />
                    <div className="h-3 w-full bg-muted/60 rounded-md" />
                    <div className="h-12 bg-muted/50 rounded-xl" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 w-16 bg-muted rounded-md" />
                      <div className="h-7 w-20 bg-muted rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              /* Error State */
              <div className="text-center py-16 rounded-2xl bg-card border border-border space-y-3">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
                <h3 className="text-base font-bold text-foreground">
                  Failed to Load Services
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {(error as Error)?.message ||
                    "Something went wrong while fetching services."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : filteredServices.length > 0 ? (
              /* Service Cards Grid */
              <>
                <p className="text-xs text-muted-foreground">
                  Showing {(visiblePage - 1) * pageSize + 1}–
                  {Math.min(visiblePage * pageSize, filteredServices.length)} of{" "}
                  {filteredServices.length} services
                </p>
                <div
                  ref={cardsGridRef}
                  className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                >
                {pageServices.map((service) => {
                  const techName =
                    service.technician?.user?.name || "Professional";
                  const techCity =
                    service.technician?.city ||
                    service.technician?.address ||
                    "Location not listed";
                  const techRating = Number(service.technician?.avgRating || 0);
                  const techReviews = service.technician?.totalReviews;
                  const techExp = service.technician?.experienceYrs;

                  return (
                    <div
                      key={service.id}
                      className="group flex h-full min-h-[27rem] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                    >
                      <div className="relative h-36 w-full overflow-hidden bg-muted">
                        <Image
                          src={service.imageUrl || service.image || "/service.jpg"}
                          alt={service.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-2.5 px-3.5 pt-3.5">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-foreground font-semibold text-[9px]">
                            {service.category?.name || "General Service"}
                          </span>

                          {service.technician?.isVerified && (
                            <span className="px-2 py-0.5 rounded-md font-semibold text-[9px] border bg-primary/10 border-primary/20 text-primary flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Desc */}
                        <div>
                          <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {service.name}
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                            {service.category?.description ||
                              service.description ||
                              "Professional service provided by background-checked experts."}
                          </p>
                        </div>

                        {/* Experience & Rate info */}
                        <div className="grid grid-cols-2 gap-1 pt-0.5">
                          <div className="p-1.5 rounded-lg bg-muted/50 border border-border/60 flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5 text-primary shrink-0" />
                            <span className="text-[9px] font-semibold text-foreground/80 truncate">
                              {techExp ? `${techExp} Yrs Exp` : "Experience not listed"}
                            </span>
                          </div>

                          <div className="p-1.5 rounded-lg bg-muted/50 border border-border/60 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                            <span className="text-[9px] font-semibold text-foreground/80 truncate">
                              {service.technician?.hourlyRate
                                ? `৳${Number(service.technician.hourlyRate).toLocaleString("en-BD")}/hr`
                                : "Rate not listed"}
                            </span>
                          </div>
                        </div>

                        {/* Technician Profile Card */}
                        <div className="p-2 rounded-xl bg-muted/50 border border-border flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">
                              <UserCheck className="w-3 h-3" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-foreground truncate">
                                {techName}
                              </p>
                              <p className="text-[8px] text-muted-foreground flex items-center gap-0.5 truncate">
                                <MapPin className="w-2 h-2 text-muted-foreground shrink-0" />
                                <span className="truncate">{techCity}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 bg-card px-1.5 py-0.5 rounded border border-border shrink-0">
                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                            <span className="text-[9px] font-bold text-foreground">
                              {techRating > 0 ? techRating.toFixed(1) : "No rating"}
                            </span>
                            {techReviews !== undefined && techReviews > 0 && (
                              <span className="text-[7px] text-muted-foreground">
                                ({techReviews})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Loading overlay when user clicked View Details */}
                      {navigatingId === service.id && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-[2px] animate-in fade-in duration-200">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="text-xs font-semibold text-foreground">
                            Opening details...
                          </span>
                        </div>
                      )}

                      {/* Footer Price & Action */}
                      <div className="mx-3.5 mb-3.5 mt-2.5 flex items-center justify-between gap-1 border-t border-border pt-2.5">
                        <div>
                          <span className="text-[8px] text-muted-foreground block uppercase font-semibold">
                            Service Price
                          </span>
                          <span className="text-sm font-extrabold text-foreground">
                            {Number.isFinite(Number(service.price))
                              ? `৳${Number(service.price).toLocaleString("en-BD")}`
                              : "Price on request"}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <Link
                            href={`/service/${service.id}`}
                            onClick={() => setNavigatingId(service.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition-all"
                          >
                            {navigatingId === service.id ? (
                              <span className="inline-flex items-center gap-1 font-bold">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Loading...</span>
                              </span>
                            ) : (
                              <span>View Details</span>
                            )}
                          </Link>
                          <Link
                            href={`/booking?serviceId=${encodeURIComponent(service.id)}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
                          >
                            Book <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
                {totalPages > 1 && (
                  <nav
                    aria-label="Service pages"
                    className="flex items-center justify-center gap-3 pt-4"
                  >
                    <button
                      type="button"
                      disabled={visiblePage === 1}
                      onClick={() => setCurrentPage((page) => page - 1)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {visiblePage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={visiblePage === totalPages}
                      onClick={() => setCurrentPage((page) => page + 1)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            ) : (
              /* No Results State */
              <div className="text-center py-16 rounded-2xl bg-card border border-border space-y-2">
                <Sparkles className="w-6 h-6 text-muted-foreground mx-auto" />
                <h3 className="text-sm font-bold text-foreground">
                  No Services Found
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Try adjusting your filter or search criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* INTERACTIVE SEARCH MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Input Box */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search className="w-5 h-5 text-primary shrink-0" />
              <input
                ref={modalInputRef}
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Search services or technicians..."
                className="w-full bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Results List */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              {modalSearch.trim() === "" ? (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  Start typing to search for services or experts...
                </div>
              ) : modalResults.length > 0 ? (
                modalResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectModalResult(item.name)}
                    className="p-3 rounded-xl bg-muted/40 hover:bg-muted border border-border flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.category?.name || "General"} •{" "}
                        {item.technician?.user?.name || "Technician"} (
                        {item.technician?.city || "Location"})
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-primary">
                      ৳{Number(item.price).toLocaleString("en-BD")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  No matching services found for "{modalSearch}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-muted/50 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                Press{" "}
                <kbd className="px-1 bg-muted border border-border rounded text-foreground">
                  ESC
                </kbd>{" "}
                to exit
              </span>
              <span className="text-primary font-semibold">
                Interactive Search
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
