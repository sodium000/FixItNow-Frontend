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
} from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES
// ============================================================================

export interface Category {
  id: string;
  name: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  city: string;
  rating: number;
  totalJobs?: number;
  specialization: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDuration: string;
  warrantyPeriod: string;
  type: "Residential" | "Commercial" | "Emergency";
  categoryId: string;
  category: Category;
  technicianId: string;
  technician: TechnicianProfile;
  isActive: boolean;
  totalBookingsCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "All Services" },
  { id: "cat-2", name: "AC Repair" },
  { id: "cat-3", name: "Installation" },
  { id: "cat-4", name: "Maintenance" },
  { id: "cat-5", name: "Duct Cleaning" },
];

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    name: "Compressor Repair & Leak Fix",
    description: "Gas leak sealing, pressure test, and compressor restoration.",
    price: 120.0,
    estimatedDuration: "2 Hours",
    warrantyPeriod: "90 Days",
    type: "Emergency",
    categoryId: "cat-2",
    category: { id: "cat-2", name: "AC Repair" },
    technicianId: "tech-1",
    technician: {
      id: "tech-1",
      name: "Tanvir Ahmed",
      city: "Dhaka",
      rating: 4.9,
      totalJobs: 340,
      specialization: "HVAC Specialist",
    },
    isActive: true,
    totalBookingsCount: 142,
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15",
  },
  {
    id: "srv-2",
    name: "Split AC Jet Wash & Servicing",
    description: "High-pressure wash, coil spray, and drain pipe clearing.",
    price: 65.5,
    estimatedDuration: "1.5 Hours",
    warrantyPeriod: "30 Days",
    type: "Residential",
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Maintenance" },
    technicianId: "tech-2",
    technician: {
      id: "tech-2",
      name: "Rahat Chowdhury",
      city: "Chittagong",
      rating: 4.7,
      totalJobs: 210,
      specialization: "Cooling Tech",
    },
    isActive: true,
    totalBookingsCount: 89,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
  {
    id: "srv-3",
    name: "VRF & Duct System Setup",
    description: "Commercial HVAC ductwork alignment and thermostat setup.",
    price: 350.0,
    estimatedDuration: "1 Day",
    warrantyPeriod: "1 Year",
    type: "Commercial",
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Installation" },
    technicianId: "tech-3",
    technician: {
      id: "tech-3",
      name: "Kazi Nabil",
      city: "Dhaka",
      rating: 4.8,
      totalJobs: 45,
      specialization: "Industrial Tech",
    },
    isActive: true,
    totalBookingsCount: 45,
    createdAt: "2026-02-10",
    updatedAt: "2026-02-10",
  },
  {
    id: "srv-4",
    name: "Freon Gas Refill R32/R410a",
    description: "System vacuuming, moisture check, and gas top-up.",
    price: 85.0,
    estimatedDuration: "1 Hour",
    warrantyPeriod: "60 Days",
    type: "Residential",
    categoryId: "cat-2",
    category: { id: "cat-2", name: "AC Repair" },
    technicianId: "tech-4",
    technician: {
      id: "tech-4",
      name: "Sabbir Hossain",
      city: "Sylhet",
      rating: 4.6,
      totalJobs: 175,
      specialization: "Gas Specialist",
    },
    isActive: true,
    totalBookingsCount: 112,
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
  },
  {
    id: "srv-5",
    name: "Inverter AC Wall Mount Setup",
    description: "Precision wall mounting, copper insulation, and electrical check.",
    price: 150.0,
    estimatedDuration: "3 Hours",
    warrantyPeriod: "180 Days",
    type: "Residential",
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Installation" },
    technicianId: "tech-1",
    technician: {
      id: "tech-1",
      name: "Tanvir Ahmed",
      city: "Dhaka",
      rating: 4.9,
      totalJobs: 340,
      specialization: "HVAC Specialist",
    },
    isActive: true,
    totalBookingsCount: 98,
    createdAt: "2026-03-12",
    updatedAt: "2026-03-12",
  },
];

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
  const [selectedCategory, setSelectedCategory] = React.useState("cat-1");
  const [selectedCity, setSelectedCity] = React.useState("All");
  const [selectedType, setSelectedType] = React.useState("All");
  const [minRating, setMinRating] = React.useState<number>(0);
  const [sortByPrice, setSortByPrice] = React.useState<"none" | "asc" | "desc">("none");

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

  // Animations
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
      }

      if (cardsGridRef.current) {
        gsap.fromTo(
          cardsGridRef.current.children,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selectedCategory, searchQuery, selectedCity, selectedType, sortByPrice]);

  // Main Page Filter Logic
  const filteredServices = React.useMemo(() => {
    return MOCK_SERVICES.filter((item) => {
      if (!item.isActive) return false;
      if (selectedCategory !== "cat-1" && item.categoryId !== selectedCategory) return false;
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.technician.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedCity !== "All" && item.technician.city !== selectedCity) return false;
      if (selectedType !== "All" && item.type !== selectedType) return false;
      if (minRating > 0 && item.technician.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortByPrice === "asc") return a.price - b.price;
      if (sortByPrice === "desc") return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedCity, selectedType, minRating, sortByPrice]);

  // Quick Modal Search Results
  const modalResults = React.useMemo(() => {
    if (!modalSearch.trim()) return [];
    return MOCK_SERVICES.filter(
      (item) =>
        item.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        item.technician.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        item.category.name.toLowerCase().includes(modalSearch.toLowerCase())
    ).slice(0, 4);
  }, [modalSearch]);

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
      {/* Background Glows (No Blue Color) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(26, 29, 27, 0.753),rgba(255,255,255,0))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.1)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div className="w-full mx-auto space-y-8 relative z-10">
        {/* HEADER SECTION (Clears Navbar) */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-gray-100 font-semibold text-xs tracking-wide">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified HVAC Experts</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-700 leading-tight">
            Book Fast & Reliable <span className="text-slate-700">Services</span>
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
          
          {/* ASIDE SIDEBAR FILTERS (4/12 width on large screens) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span>Filters & Categories</span>
              </div>

              {(selectedCategory !== "cat-1" ||
                selectedCity !== "All" ||
                selectedType !== "All" ||
                minRating > 0 ||
                searchQuery !== "") && (
                <button
                  onClick={() => {
                    setSelectedCategory("cat-1");
                    setSelectedCity("All");
                    setSelectedType("All");
                    setMinRating(0);
                    setSearchQuery("");
                  }}
                  className="text-[10px] text-emerald-900 hover:underline font-semibold"
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
              <div className="flex flex-col gap-1">
                {MOCK_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gray-400 text-slate-950 font-bold shadow-md shadow-emerald-400/10"
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
            <div className="space-y-1.5 pt-2  border-t border-slate-800/60">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> City Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5  outline-none cursor-pointer focus:border-gray-400"
              >
                <option value="All">All Cities</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
              </select>
            </div>

            {/* Service Type */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" /> Service Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-gray-400"
              >
                <option value="All">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-gray-400"
              >
                <option value={0}>Any Rating</option>
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
                onChange={(e) => setSortByPrice(e.target.value as "none" | "asc" | "desc")}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer focus:border-gray-400"
              >
                <option value="none">Default Order</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </aside>

          {/* MAIN CONTENT AREA: 4-5 CARDS GRID (9/12 width) */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Active Query Banner */}
            {searchQuery && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span>Showing search results for: <strong className="text-emerald-400">"{searchQuery}"</strong></span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {filteredServices.length > 0 ? (
              <div
                ref={cardsGridRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5"
              >
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="group rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/40 p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 relative overflow-hidden backdrop-blur-md"
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-emerald-400 font-semibold text-[9px]">
                          {service.category.name}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[9px] border ${
                            service.type === "Emergency"
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                              : service.type === "Commercial"
                              ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                              : "bg-teal-500/10 border-teal-500/30 text-teal-400"
                          }`}
                        >
                          {service.type}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                          {service.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                          {service.description}
                        </p>
                      </div>

                      {/* Duration & Warranty */}
                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        <div className="p-1 rounded-lg bg-slate-950/80 border border-slate-800/60 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span className="text-[9px] font-semibold text-slate-300 truncate">{service.estimatedDuration}</span>
                        </div>

                        <div className="p-1 rounded-lg bg-slate-950/80 border border-slate-800/60 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          <span className="text-[9px] font-semibold text-slate-300 truncate">{service.warrantyPeriod}</span>
                        </div>
                      </div>

                      {/* Technician Banner */}
                      <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold text-[9px] shrink-0">
                            <UserCheck className="w-3 h-3" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white truncate">
                              {service.technician.name}
                            </p>
                            <p className="text-[8px] text-slate-400 flex items-center gap-0.5 truncate">
                              <MapPin className="w-2 h-2 text-slate-500" />
                              {service.technician.city}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 bg-slate-900 px-1 py-0.5 rounded border border-slate-800 shrink-0">
                          <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                          <span className="text-[9px] font-bold text-white">
                            {service.technician.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Price & Action */}
                    <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-semibold">Price</span>
                        <span className="text-sm font-extrabold text-white">
                          ${service.price.toFixed(0)}
                        </span>
                      </div>

                      <Link href={"/booking"}>
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
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl space-y-2 ">
                <Sparkles className="w-6 h-6 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-gray-900">No Services Found</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Try adjusting your filter or search criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE SEARCH MODAL POPUP (Ctrl + K / Cmd + K) */}
      {/* ========================================================================= */}
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
                        {item.category.name} • {item.technician.name} ({item.technician.city})
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">
                      ${item.price.toFixed(0)}
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
              <span>Press <kbd className="px-1 bg-slate-800 rounded text-slate-300">ESC</kbd> to exit</span>
              <span className="text-emerald-400 font-semibold">Interactive Search</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}