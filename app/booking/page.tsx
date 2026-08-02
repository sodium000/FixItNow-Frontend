"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Calendar as CalendarIcon,
  Clock,
  PhoneCall,
  User,
  MapPin,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  MessageCircle,
  ExternalLink,
  Wrench,
  BadgeCheck,
  ArrowRight,
  ChevronRight,
  FileText,
  AlertCircle,
  Check,
} from "lucide-react";

import {
  MOCK_TECHNICIANS,
  MOCK_SERVICE_CATEGORIES,
  formatCurrency,
  CURRENT_USER,
} from "@/lib/mock-data";
import type { TechnicianProfile, ServiceCategory, ServiceItem } from "@/lib/types";

// ============================================================================
// TYPES & TIME SLOTS
// ============================================================================

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: "slot-1", time: "09:00 AM", available: true },
  { id: "slot-2", time: "11:30 AM", available: true },
  { id: "slot-3", time: "02:00 PM", available: false },
  { id: "slot-4", time: "04:30 PM", available: true },
  { id: "slot-5", time: "07:00 PM", available: true },
  { id: "slot-6", time: "09:00 PM", available: false },
];

// Flatten all available services with their parent category name
interface CombinedServiceItem extends ServiceItem {
  categoryName: string;
}

const ALL_SERVICES: CombinedServiceItem[] = MOCK_SERVICE_CATEGORIES.flatMap((cat) =>
  cat.services.map((svc) => ({
    ...svc,
    categoryName: cat.name,
  }))
);

// ============================================================================
// MAIN BOOKING COMPONENT
// ============================================================================

export default function BookingPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const formCardRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  // Category & Service Selection
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(
    MOCK_SERVICE_CATEGORIES[1].id // AC & Cooling default
  );

  const availableServices = React.useMemo(() => {
    const category = MOCK_SERVICE_CATEGORIES.find((c) => c.id === selectedCategoryId);
    return category ? category.services : ALL_SERVICES;
  }, [selectedCategoryId]);

  const [selectedService, setSelectedService] = React.useState<CombinedServiceItem>(
    ALL_SERVICES.find((s) => s.id === "svc-003") || ALL_SERVICES[0]
  );

  // Technician Selection
  const [selectedTech, setSelectedTech] = React.useState<TechnicianProfile>(
    MOCK_TECHNICIANS[0]
  );

  // Auto-match technician when service changes
  React.useEffect(() => {
    const matchedTech = MOCK_TECHNICIANS.find((t) => t.id === selectedService.technicianId);
    if (matchedTech) {
      setSelectedTech(matchedTech);
    }
  }, [selectedService]);

  // Date & Time Slot
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string>("09:00 AM");

  // Form Inputs
  const [formData, setFormData] = React.useState({
    name: CURRENT_USER.name,
    phone: CURRENT_USER.phone || "+880 1700-000001",
    address: "House 12, Road 5, Gulshan, Dhaka",
    notes: "",
  });

  // Booking State & Confirmation Details
  const [bookingConfirmed, setBookingConfirmed] = React.useState<boolean>(false);
  const [confirmedDetails, setConfirmedDetails] = React.useState<{
    bookingId: string;
    serviceName: string;
    techName: string;
    date: string;
    time: string;
    address: string;
    amount: number;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedDetails({
      bookingId: randomId,
      serviceName: selectedService.name,
      techName: selectedTech.user?.name || "Expert Technician",
      date: selectedDate,
      time: selectedTimeSlot,
      address: formData.address,
      amount: selectedService.price,
    });
    setBookingConfirmed(true);
  };

  // GSAP Animations
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
      }

      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.15 }
        );
      }

      if (sidebarRef.current) {
        gsap.fromTo(
          sidebarRef.current,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.25 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden"
    >
      {/* Background Gradients & Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/3 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-[130px] z-0"
      />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* HEADER SECTION */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/60 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>On-Demand Verified Home Services</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Schedule Service or <span className="text-primary">Call Specialist</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Select your required service, choose a background-checked technician, and reserve a convenient time slot with transparent pricing.
          </p>
        </div>

        {/* MAIN TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: INTERACTIVE BOOKING FORM (7/12 width) */}
          <div
            ref={formCardRef}
            className="lg:col-span-7 bg-card/80 text-card-foreground border border-border/80 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-md space-y-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Appointment Details
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Complete your booking in 4 easy steps
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                Step-by-Step
              </span>
            </div>

            {bookingConfirmed && confirmedDetails ? (
              <div className="p-6 sm:p-8 bg-secondary/40 border border-primary/30 rounded-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    Booking Confirmed #{confirmedDetails.bookingId}
                  </span>
                  <h3 className="text-xl font-extrabold text-foreground pt-2">
                    Your Appointment is Reserved!
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    We have dispatched your request to{" "}
                    <strong className="text-foreground">{confirmedDetails.techName}</strong>. Our specialist will contact you shortly.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-4 bg-background/80 border border-border/80 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-bold text-foreground">{confirmedDetails.serviceName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-bold text-foreground">
                      {confirmedDetails.date} at {confirmedDetails.time}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">Service Address</span>
                    <span className="font-bold text-foreground truncate max-w-[200px]">
                      {confirmedDetails.address}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-extrabold text-sm">
                    <span>Total Cost</span>
                    <span className="text-primary">{formatCurrency(confirmedDetails.amount)}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/dashboard/customer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View My Bookings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setBookingConfirmed(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-xs rounded-xl border border-border transition-all"
                  >
                    Book Another Service
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                
                {/* STEP 1: CATEGORY & SERVICE SELECTION */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" />
                    <span>1. Select Service Category & Service</span>
                  </label>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2">
                    {MOCK_SERVICE_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            const firstSvc = cat.services[0];
                            if (firstSvc) {
                              setSelectedService({ ...firstSvc, categoryName: cat.name });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                              : "bg-secondary/60 text-muted-foreground border-border/80 hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Service Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {availableServices.map((svc) => {
                      const isSelected = selectedService.id === svc.id;
                      return (
                        <div
                          key={svc.id}
                          onClick={() =>
                            setSelectedService({
                              ...svc,
                              categoryName:
                                (svc as CombinedServiceItem).categoryName || "Home Service",
                            })
                          }
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-primary/10 border-primary shadow-md"
                              : "bg-background/60 border-border/80 hover:border-border hover:bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-foreground leading-snug">
                              {svc.name}
                            </h4>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/60">
                            <span className="text-[10px] text-muted-foreground font-medium">
                              Estimated Rate
                            </span>
                            <span className="text-xs font-extrabold text-primary">
                              {formatCurrency(svc.price)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: TECHNICIAN PICKER */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>2. Choose Expert Specialist</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MOCK_TECHNICIANS.map((tech) => {
                      const isSelected = selectedTech.id === tech.id;
                      const isMatched = selectedService.technicianId === tech.id;

                      return (
                        <div
                          key={tech.id}
                          onClick={() => setSelectedTech(tech)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? "bg-primary/10 border-primary shadow-md"
                              : "bg-background/60 border-border/80 hover:border-border hover:bg-background"
                          }`}
                        >
                          {isMatched && (
                            <span className="absolute -top-2 -right-2 bg-amber-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                              Matched
                            </span>
                          )}

                          <div className="flex items-center gap-3 mb-2.5">
                            <img
                              src={
                                tech.user?.photoUrl ||
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                              }
                              alt={tech.user?.name || "Technician"}
                              className="w-10 h-10 rounded-full object-cover border border-border"
                            />
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1">
                                <h4 className="text-xs font-bold text-foreground truncate">
                                  {tech.user?.name}
                                </h4>
                                {tech.isVerified && (
                                  <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {tech.city} • {tech.experienceYrs} yrs exp
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                            <span className="text-amber-500 font-extrabold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {tech.avgRating} ({tech.totalReviews})
                            </span>
                            <span className="text-xs font-bold text-foreground">
                              ৳{tech.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 3: DATE & TIME SLOT PICKER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Date Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      3. Service Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-background border border-border text-foreground text-xs rounded-xl p-3 outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  {/* Time Slots Dropdown/Grid */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`p-2 rounded-xl text-[11px] font-semibold transition-all ${
                              !slot.available
                                ? "bg-muted text-muted-foreground/50 border-transparent cursor-not-allowed line-through"
                                : isSelected
                                ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                                : "bg-background border-border text-foreground hover:border-primary/50"
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* STEP 4: CUSTOMER DETAILS & ADDRESS */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>4. Contact & Service Location</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        Full Name
                      </span>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border text-foreground text-xs rounded-xl px-3 py-2.5 outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        Phone Number
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border text-foreground text-xs rounded-xl px-3 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      Service Address / Location
                    </span>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House No, Road, Area, City"
                        className="w-full bg-background border border-border text-foreground text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* SUBMIT ACTION BUTTON */}
                <div className="pt-4 border-t border-border">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:bg-primary/90 active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Confirm Appointment ({formatCurrency(selectedService.price)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: HOTLINE, WHATSAPP & SUPPORT (5/12 width) */}
          <div ref={sidebarRef} className="lg:col-span-5 space-y-6">
            <div className="bg-card/80 text-card-foreground border border-border/80 p-6 rounded-3xl shadow-xl backdrop-blur-md space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Instant Specialist Contact
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    1-on-1 priority hotline & WhatsApp
                  </p>
                </div>
              </div>

              {/* Selected Technician Card Preview */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/80 flex items-center gap-3">
                <img
                  src={
                    selectedTech.user?.photoUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={selectedTech.user?.name || "Technician"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground truncate">
                      {selectedTech.user?.name}
                    </h3>
                    <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      ৳{selectedTech.hourlyRate}/hr
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {selectedTech.city} • Verified Specialist
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{selectedTech.avgRating} Rating ({selectedTech.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Need immediate help before booking? Connect directly with{" "}
                <strong className="text-foreground">{selectedTech.user?.name}</strong> or our central customer desk.
              </p>

              {/* Contact Buttons Stack */}
              <div className="space-y-3">
                {/* Direct Call Button */}
                <a
                  href={`tel:${selectedTech.user?.phone || "+8801700100001"}`}
                  className="p-4 rounded-2xl bg-background border border-border/80 hover:border-primary/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        Direct Phone Call
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {selectedTech.user?.phone || "+880 1700-100001"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-secondary px-2.5 py-1 rounded-lg border border-border/60 flex items-center gap-1">
                    Call Now <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={`https://wa.me/${(selectedTech.user?.phone || "8801700100001").replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(selectedTech.user?.name || "Technician")},%20I%20am%20interested%20in%20booking%20a%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-background border border-border/80 hover:border-emerald-500/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                        WhatsApp Live Chat
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Chat directly on WhatsApp
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-secondary px-2.5 py-1 rounded-lg border border-border/60 flex items-center gap-1">
                    WhatsApp <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>

                {/* Central Hotline Button */}
                <a
                  href="tel:+8801800000000"
                  className="p-4 rounded-2xl bg-background border border-border/80 hover:border-primary/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        Central Hotline
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        +880 1800-000000
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg border border-border/60">
                    24/7 Support
                  </span>
                </a>
              </div>

              {/* Trust & Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    FixItNow Property Guarantee
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Every appointment is backed by our up to ৳50,000 property damage protection & 100% satisfaction guarantee.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}