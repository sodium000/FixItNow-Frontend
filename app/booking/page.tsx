"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  PhoneCall,
  MessageSquare,
  User,
  Mail,
  MapPin,
  CheckCircle2,
  Send,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  MessageCircle,
  ExternalLink,
  DollarSign,
  Wrench,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  priceRate: string;
  hourlyFee: number;
  phone: string;
  whatsapp: string;
  avatar: string;
  specialty: string;
  available: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const TIME_SLOTS: TimeSlot[] = [
  { id: "slot-1", time: "09:00 AM", available: true },
  { id: "slot-2", time: "11:00 AM", available: true },
  { id: "slot-3", time: "01:00 PM", available: false },
  { id: "slot-4", time: "03:00 PM", available: true },
  { id: "slot-5", time: "05:00 PM", available: true },
  { id: "slot-6", time: "07:00 PM", available: false },
];

const TECHNICIANS: Technician[] = [
  {
    id: "tech-1",
    name: "Alex Morgan",
    role: "Senior Electrical Engineer",
    rating: 4.9,
    reviewsCount: 128,
    priceRate: "$45 / hr",
    hourlyFee: 45,
    phone: "+8801700000001",
    whatsapp: "8801700000001",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    specialty: "Wiring, Circuit Breakers & HVAC",
    available: true,
  },
  {
    id: "tech-2",
    name: "Rahim Chowdhury",
    role: "Master Plumber & Pipe Specialist",
    rating: 4.8,
    reviewsCount: 94,
    priceRate: "$40 / hr",
    hourlyFee: 40,
    phone: "+8801800000002",
    whatsapp: "8801800000002",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    specialty: "Leak Repair, Drainage & Pumps",
    available: true,
  },
  {
    id: "tech-3",
    name: "Tanvir Ahmed",
    role: "Appliance & AC Technician",
    rating: 4.7,
    reviewsCount: 65,
    priceRate: "$35 / hr",
    hourlyFee: 35,
    phone: "+8801900000003",
    whatsapp: "8801900000003",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    specialty: "Air Conditioning & Refrigerator",
    available: true,
  },
];

const SERVICES = [
  { id: "srv-1", name: "Emergency Repair & Diagnostics", basePrice: "$50 flat" },
  { id: "srv-2", name: "Full Home Maintenance Inspection", basePrice: "$80 flat" },
  { id: "srv-3", name: "Standard Installation Service", basePrice: "$35 base" },
];

// ============================================================================
// MAIN BOOKING COMPONENT
// ============================================================================

export default function BookingPage() {
  // Calendar & Booking States
  const [selectedService, setSelectedService] = React.useState<string>(SERVICES[0].name);
  const [selectedTech, setSelectedTech] = React.useState<Technician>(TECHNICIANS[0]);
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string>("09:00 AM");
  const [bookingConfirmed, setBookingConfirmed] = React.useState<boolean>(false);

  // Message Form States
  const [messageSubmitted, setMessageSubmitted] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSubmitted(true);
    setTimeout(() => setMessageSubmitted(false), 4000);
  };

  return (
    <div className="relative min-h-screen text-neutral-100 selection:bg-yellow-400/30 selection:text-yellow-300 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(250,204,21,0.08),rgba(255,255,255,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"
      />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-yellow-400 font-bold text-xs tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Expert On-Demand Assistance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Book Service or <span className="text-yellow-400">Connect Instantly</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400">
            Choose your preferred technician, set your preferred schedule, or initiate an instant 1-to-1 live call or WhatsApp chat.
          </p>
        </div>

        {/* TOP SECTION: CALENDAR & TECHNICIANS + REDESIGNED CALL & WHATSAPP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 1. CALENDAR, SERVICE & TECHNICIAN SELECTION (7/12 width) */}
          <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 p-6 rounded-2xl shadow-2xl backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-yellow-400" />
                <h2 className="text-base font-bold text-white">
                  1. Service & Schedule Selection
                </h2>
              </div>
              <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full">
                Step 1 of 2
              </span>
            </div>

            {bookingConfirmed ? (
              <div className="p-6 bg-neutral-950 border border-yellow-500/30 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-yellow-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">
                  Booking Request Received!
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Your appointment for <strong className="text-white">{selectedService}</strong> with{" "}
                  <strong className="text-yellow-400">{selectedTech.name}</strong> on{" "}
                  <strong className="text-yellow-400">{selectedDate}</strong> at{" "}
                  <strong className="text-yellow-400">{selectedTimeSlot}</strong> has been reserved.
                </p>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 inline-block text-xs text-neutral-300">
                  Estimated Rate: <span className="text-yellow-400 font-bold">{selectedTech.priceRate}</span>
                </div>
                <div>
                  <button
                    onClick={() => setBookingConfirmed(false)}
                    className="mt-2 text-xs text-neutral-400 hover:text-yellow-400 underline transition-colors"
                  >
                    Book another slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-yellow-400" /> Choose Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xl p-3 outline-none focus:border-yellow-400 transition-colors"
                  >
                    {SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.name}>
                        {srv.name} — ({srv.basePrice})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technician Picker Card List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-yellow-400" /> Select Technician
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TECHNICIANS.map((tech) => {
                      const isSelected = selectedTech.id === tech.id;
                      return (
                        <div
                          key={tech.id}
                          onClick={() => setSelectedTech(tech)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-yellow-400/10 border-yellow-400 shadow-md shadow-yellow-400/5"
                              : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-2">
                            <img
                              src={tech.avatar}
                              alt={tech.name}
                              className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                            />
                            <div className="overflow-hidden">
                              <h4 className="text-xs font-bold text-white truncate">
                                {tech.name}
                              </h4>
                              <p className="text-[10px] text-neutral-400 truncate">
                                {tech.role}
                              </p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                            <span className="text-yellow-400 font-extrabold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {tech.rating}
                            </span>
                            <span className="text-white font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                              {tech.priceRate}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Choose Service Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xl p-3 outline-none focus:border-yellow-400 transition-colors"
                    required
                  />
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" /> Available Slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            !slot.available
                              ? "bg-neutral-950 border-neutral-800 text-neutral-600 cursor-not-allowed line-through"
                              : isSelected
                                ? "bg-yellow-400 text-neutral-950 border-yellow-400 shadow-lg shadow-yellow-400/10 font-bold"
                                : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-yellow-500/50 hover:text-white"
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* User Info Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 font-semibold">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 font-semibold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+880 1700-000000"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-yellow-400/10 active:scale-95"
                >
                  Confirm Appointment ({selectedTech.priceRate})
                </button>
              </form>
            )}
          </div>

          {/* 2. DIRECT HOTLINE & INSTANT CHAT REDESIGN (5/12 width) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 p-6 rounded-2xl shadow-2xl backdrop-blur-md space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
                <PhoneCall className="w-5 h-5 text-yellow-400" />
                <h2 className="text-base font-bold text-white">
                  2. Instant 1-on-1 Contact
                </h2>
              </div>

              {/* Selected Technician Brief Banner */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-yellow-500/20 flex items-center gap-3">
                <img
                  src={selectedTech.avatar}
                  alt={selectedTech.name}
                  className="w-12 h-12 rounded-full object-cover border border-yellow-400"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white">{selectedTech.name}</h3>
                    <span className="text-[10px] text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">
                      {selectedTech.priceRate}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400">{selectedTech.role}</p>
                  <p className="text-[10px] text-neutral-500 truncate">{selectedTech.specialty}</p>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect directly with <strong className="text-white">{selectedTech.name}</strong> or our priority customer team using your preferred channel.
              </p>

              {/* Communication Action Cards */}
              <div className="space-y-3">
                {/* Direct Phone Call Card */}
                <a
                  href={`tel:${selectedTech.phone}`}
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-yellow-400/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 flex items-center justify-center shrink-0 group-hover:bg-yellow-400 group-hover:text-neutral-950 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                        Direct Phone Call
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {selectedTech.phone}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800 flex items-center gap-1">
                    Call Now <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>

                {/* WhatsApp Chat Card */}
                <a
                  href={`https://wa.me/${selectedTech.whatsapp}?text=Hello%20${encodeURIComponent(selectedTech.name)},%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        WhatsApp Message
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        Instant chat with {selectedTech.name.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800 flex items-center gap-1">
                    WhatsApp <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>

                {/* 1-to-1 Hotline Support Card */}
                <a
                  href="tel:+8801800000000"
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-yellow-400/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                        Central Hotline
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        +880 1800-000000
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">
                    24/7 Support
                  </span>
                </a>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 flex items-center gap-2 text-[10px] text-neutral-400 border-t border-neutral-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>
                  Verified & background-checked experts ready for dispatch.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}