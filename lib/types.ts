export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type BookingStatus =
  | "PENDING"
  | "ACCEPT"
  | "COMPLETED"
  | "CANCELLED"
  | "DECLINE";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  user?: User;
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
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  technicianId: string;
  technician?: TechnicianProfile;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: ServiceItem[];
}

export interface Booking {
  id: string;
  customerId: string;
  customer?: User;
  technicianId: string;
  technician?: TechnicianProfile;
  serviceId: string;
  service?: ServiceItem & { categoryName?: string };
  scheduledAt: string;
  address: string;
  notes?: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  bookings: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalTechnicians: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
}
