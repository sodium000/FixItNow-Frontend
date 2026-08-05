"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils";

import { formatCurrency } from "@/lib/mock-data";
import {
  getServicesAction,
  getServiceByIdAction,
} from "../service/serviceAction";
import { getMyProfileAction } from "@/lib/profileAction";
import {
  createBookingAction,
  createCheckoutSessionAction,
} from "./bookingAction";
import Image from "next/image";

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
  { id: "slot-3", time: "02:00 PM", available: true },
  { id: "slot-4", time: "04:30 PM", available: true },
  { id: "slot-5", time: "07:00 PM", available: true },
  { id: "slot-6", time: "09:00 PM", available: true },
];

export interface ServiceData {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  technicianId?: string;
  technician?: any;
}

// ============================================================================
// BOOKING FORM COMPONENT (Wrapped in Suspense)
// ============================================================================

function BookingContent() {
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get("serviceId");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const formCardRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  // ── Fetch Service(s) from Database API ──
  const { data: rawServicesData, isLoading: isServicesLoading } = useQuery({
    queryKey: ["services", serviceIdParam],
    queryFn: async () => {
      if (serviceIdParam) {
        const singleRes = await getServiceByIdAction(serviceIdParam);
        if (singleRes.success && singleRes.data) {
          return Array.isArray(singleRes.data)
            ? singleRes.data
            : [singleRes.data];
        }
      }
      const allRes = await getServicesAction();
      return allRes.success ? allRes.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // ── Fetch Logged-in User Profile from API (/api/auth/me) ──
  const { data: userProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const result = await getMyProfileAction();
      return result.success ? result.data : null;
    },
  });

  // Format Services List from DB
  const servicesList: ServiceData[] = React.useMemo(() => {
    if (
      rawServicesData &&
      Array.isArray(rawServicesData) &&
      rawServicesData.length > 0
    ) {
      return rawServicesData.map((s: any) => ({
        id: s.id,
        name: s.name,
        price: typeof s.price === "string" ? parseFloat(s.price) : s.price || 0,
        description: s.description || s.category?.description || "",
        technicianId: s.technicianId,
        categoryName: s.category?.name || "Home Service",
        categoryId: s.categoryId,
        technician: s.technician,
      }));
    }
    return [];
  }, [rawServicesData]);

  // Selected Service state
  const [selectedService, setSelectedService] =
    React.useState<ServiceData | null>(null);

  // Handle service selection when DB data arrives
  React.useEffect(() => {
    if (servicesList.length > 0) {
      const target = serviceIdParam
        ? servicesList.find((s) => s.id === serviceIdParam) || servicesList[0]
        : servicesList[0];
      if (target) {
        setSelectedService(target);
      }
    }
  }, [servicesList, serviceIdParam]);

  // Selected Technician state derived directly from Database
  const selectedTech = React.useMemo(() => {
    if (!selectedService?.technician) {
      return {
        id: selectedService?.technicianId || "tech-default",
        name: "Verified Specialist",
        email: "support@fixitnow.com",
        phone: "+880 1700-000000",
        photoUrl: null,
        city: "Dhaka",
        experienceYrs: 5,
        hourlyRate: selectedService?.price || 50,
        avgRating: 4.9,
        totalReviews: 15,
        isVerified: true,
      };
    }
    const t = selectedService.technician;
    return {
      id: t.id,
      userId: t.userId,
      name: t.user?.name || "Expert Specialist",
      email: t.user?.email || "specialist@fixitnow.com",
      phone: t.user?.phone || "+880 1700-000000",
      photoUrl: t.user?.photoUrl || null,
      city: t.city || "Dhaka",
      experienceYrs: t.experienceYrs || 0,
      hourlyRate:
        typeof t.hourlyRate === "string"
          ? parseFloat(t.hourlyRate)
          : t.hourlyRate || 0,
      avgRating: t.avgRating || 0,
      totalReviews: t.totalReviews || 0,
      isVerified: t.isVerified ?? true,
    };
  }, [selectedService]);

  // Date & Time Slot
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0],
  );
  const [selectedTimeSlot, setSelectedTimeSlot] =
    React.useState<string>("09:00 AM");

  // Form Inputs (Pre-filled from authenticated user profile)
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Update form values when authenticated user profile arrives
  React.useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || prev.name,
        phone: userProfile.phone || prev.phone,
      }));
    }
  }, [userProfile]);

  // Submission & Error State
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] =
    React.useState<boolean>(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SUBMIT BOOKING & INITIATE STRIPE PAYMENT CHECKOUT
  // ──────────────────────────────────────────────────────────────────────────
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsSubmitting(true);
    setSubmitError("");
    const toastId = toast.loading("Processing booking & preparing Stripe checkout...");

    try {
      const scheduledAtIso = new Date(
        `${selectedDate}T17:00:00.000Z`,
      ).toISOString();

      // 1. Call createBookingAction -> POST /api/bookings
      const bookingRes = await createBookingAction({
        serviceId: selectedService.id,
        scheduledAt: scheduledAtIso,
        address: formData.address,
        notes: formData.notes || "Customer appointment",
      });

      if (!bookingRes.success) {
        const errorText = getErrorMessage(bookingRes.error, "Failed to create booking.");
        toast.error(errorText, { id: toastId });
        setSubmitError(errorText);
        setIsSubmitting(false);
        return;
      }

      const bookingData = bookingRes.data?.booking || bookingRes.data;
      const bookingId = bookingData?.id || bookingRes.data?.bookingId;

      if (!bookingId) {
        toast.error("Booking created, but no booking ID returned.", { id: toastId });
        setSubmitError("Booking created, but no booking ID was returned.");
        setIsSubmitting(false);
        return;
      }

      // 2. Call createCheckoutSessionAction -> POST /api/payments/checkout
      const checkoutRes = await createCheckoutSessionAction(bookingId);

      if (checkoutRes.success && checkoutRes.url) {
        toast.success("Booking confirmed! Redirecting to payment...", { id: toastId });
        window.location.href = checkoutRes.url;
        return;
      }

      toast.success("Booking submitted successfully!", { id: toastId });
      setConfirmedDetails({
        bookingId,
        serviceName: selectedService.name,
        techName: selectedTech.name,
        date: selectedDate,
        time: selectedTimeSlot,
        address: formData.address,
        amount: selectedService.price,
      });
      setBookingConfirmed(true);
    } catch (err: any) {
      const errMsg = err?.message || "An error occurred during checkout.";
      toast.error(errMsg, { id: toastId });
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.15 },
        );
      }

      if (sidebarRef.current) {
        gsap.fromTo(
          sidebarRef.current,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.25 },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (isServicesLoading || !selectedService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-semibold text-muted-foreground">
          Loading service details from database...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden"
    >
      {/* Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* HEADER SECTION */}
        <div
          ref={headerRef}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/60 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Verified Database On-Demand Service</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Schedule Service or{" "}
            <span className="text-primary">Call Specialist</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Confirm your booking details below and proceed to secure online
            payment.
          </p>
        </div>

        {/* MAIN TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: BOOKING FORM */}
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
                    Database Verified Booking
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                Step-by-Step
              </span>
            </div>

            {/* Error Notification Alert */}
            {submitError && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

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
                    <strong className="text-foreground">
                      {confirmedDetails.techName}
                    </strong>
                    . Our specialist will contact you shortly.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-4 bg-background/80 border border-border/80 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-bold text-foreground">
                      {confirmedDetails.serviceName}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-bold text-foreground">
                      {confirmedDetails.date} at {confirmedDetails.time}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">
                      Service Address
                    </span>
                    <span className="font-bold text-foreground truncate max-w-[200px]">
                      {confirmedDetails.address}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-extrabold text-sm">
                    <span>Total Cost</span>
                    <span className="text-primary">
                      {formatCurrency(confirmedDetails.amount)}
                    </span>
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
                {/* STEP 1: SERVICE DETAILS FROM DATABASE */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" />
                    <span>1. Selected Service (Database Verified)</span>
                  </label>

                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary shadow-md flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground">
                        {selectedService.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Category: {selectedService.categoryName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-muted-foreground block">
                        Rate
                      </span>
                      <span className="text-base font-extrabold text-primary">
                        {formatCurrency(selectedService.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* STEP 2: ASSIGNED TECHNICIAN FROM DATABASE */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>2. Assigned Specialist (Database Record)</span>
                  </label>

                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary shadow-md relative flex items-center gap-4">
                    <span className="absolute -top-2.5 right-4 bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      Assigned Specialist
                    </span>

                    <Image
                    width={50}
                    height={50}
                      src={
                        selectedTech.photoUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={selectedTech.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-primary shadow-sm"
                    />

                    <div className="flex-1 overflow-hidden space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-foreground truncate">
                          {selectedTech.name}
                        </h4>
                        {selectedTech.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedTech.city} • {selectedTech.experienceYrs} yrs
                        exp
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-xs">
                        <span className="text-amber-500 font-extrabold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {selectedTech.avgRating} ({selectedTech.totalReviews}{" "}
                          reviews)
                        </span>
                        <span className="text-muted-foreground font-semibold">
                          ৳{selectedTech.hourlyRate}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 3: DATE & TIME SLOT PICKER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Preferred
                      Slot
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

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      Notes / Preferences (Optional)
                    </span>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Customer prefers evening appointment"
                      className="w-full bg-background border border-border text-foreground text-xs rounded-xl px-3 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* SUBMIT ACTION BUTTON */}
                <div className="pt-4 border-t border-border">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:bg-primary/90 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
                        <span>Processing Booking & Stripe Checkout...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Confirm & Pay ({formatCurrency(selectedService.price)}
                          )
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: HOTLINE & SUPPORT */}
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
                <Image
                width={50}
                height={50}
                  src={
                    selectedTech.photoUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={selectedTech.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground truncate">
                      {selectedTech.name}
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
                    <span>
                      {selectedTech.avgRating} Rating (
                      {selectedTech.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Need immediate help before booking? Connect directly with{" "}
                <strong className="text-foreground">{selectedTech.name}</strong>{" "}
                or our central customer desk.
              </p>

              {/* Contact Buttons Stack */}
              <div className="space-y-3">
                <a
                  href={`tel:${selectedTech.phone}`}
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
                        {selectedTech.phone}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-secondary px-2.5 py-1 rounded-lg border border-border/60 flex items-center gap-1">
                    Call Now <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>

                <a
                  href={`https://wa.me/${selectedTech.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(selectedTech.name)},%20I%20am%20interested%20in%20booking%20a%20service.`}
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

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    FixItNow Property Guarantee
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Every appointment is backed by our up to ৳50,000 property
                    damage protection & 100% satisfaction guarantee.
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

export default function BookingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingContent />
    </React.Suspense>
  );
}
