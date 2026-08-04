import type {
  Booking,
  RevenueDataPoint,
  ServiceCategory,
  TechnicianProfile,
  User,
} from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "usr-001",
    name: "Raisul Islam",
    email: "raisul@example.com",
    phone: "+880 1700-000001",
    role: "CUSTOMER",
    isActive: true,
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    createdAt: "2025-11-15T08:30:00.000Z",
    updatedAt: "2026-05-10T14:20:00.000Z",
  },
  {
    id: "usr-002",
    name: "Mahmud Hasan",
    email: "mahmud@example.com",
    phone: "+880 1700-000002",
    role: "CUSTOMER",
    isActive: true,
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    createdAt: "2025-12-01T10:00:00.000Z",
    updatedAt: "2026-04-20T09:00:00.000Z",
  },
  {
    id: "usr-003",
    name: "Sumi Rahman",
    email: "sumi@example.com",
    phone: "+880 1700-000003",
    role: "CUSTOMER",
    isActive: true,
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    createdAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-05-01T11:00:00.000Z",
  },
  {
    id: "usr-admin",
    name: "Admin User",
    email: "admin@fixitnow.com",
    phone: "+880 1700-000099",
    role: "ADMIN",
    isActive: true,
    photoUrl:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80",
    createdAt: "2025-06-01T00:00:00.000Z",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
];

export const MOCK_TECHNICIANS: TechnicianProfile[] = [
  {
    id: "4b24fde1-7516-43e4-856a-d13a2437aff2",
    userId: "usr-tech-001",
    user: {
      id: "usr-tech-001",
      name: "Tanvir Ahmed",
      email: "tanvir@example.com",
      phone: "+880 1700-100001",
      role: "TECHNICIAN",
      isActive: true,
      photoUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80",
      createdAt: "2025-08-01T00:00:00.000Z",
      updatedAt: "2026-05-10T00:00:00.000Z",
    },
    experienceYrs: 5,
    hourlyRate: 45,
    isVerified: true,
    isAvailable: true,
    address: "Gulshan",
    city: "Dhaka",
    avgRating: 4.9,
    totalReviews: 32,
    createdAt: "2025-08-01T00:00:00.000Z",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
  {
    id: "616baf2d-b1b0-4696-a17a-d60a7dadef67",
    userId: "usr-tech-002",
    user: {
      id: "usr-tech-002",
      name: "Kazi Nabil",
      email: "nabil@example.com",
      phone: "+880 1700-100002",
      role: "TECHNICIAN",
      isActive: true,
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      createdAt: "2025-09-15T00:00:00.000Z",
      updatedAt: "2026-05-10T00:00:00.000Z",
    },
    experienceYrs: 3,
    hourlyRate: 35,
    isVerified: true,
    isAvailable: false,
    address: "Banani",
    city: "Dhaka",
    avgRating: 4.6,
    totalReviews: 18,
    createdAt: "2025-09-15T00:00:00.000Z",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
  {
    id: "tech-003",
    userId: "usr-tech-003",
    user: {
      id: "usr-tech-003",
      name: "Farhana Akter",
      email: "farhana@example.com",
      phone: "+880 1700-100003",
      role: "TECHNICIAN",
      isActive: true,
      photoUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      createdAt: "2026-01-20T00:00:00.000Z",
      updatedAt: "2026-05-10T00:00:00.000Z",
    },
    experienceYrs: 4,
    hourlyRate: 40,
    isVerified: false,
    isAvailable: true,
    address: "Dhanmondi",
    city: "Dhaka",
    avgRating: 4.3,
    totalReviews: 7,
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
];

export const MOCK_SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "cat-moving",
    name: "Moving Service",
    description: "Home and office relocation services",
    services: [
      {
        id: "svc-001",
        name: "Apartment Moving",
        price: 4000,
        technicianId: "4b24fde1-7516-43e4-856a-d13a2437aff2",
      },
      {
        id: "svc-002",
        name: "Office Relocation",
        price: 8000,
        technicianId: "616baf2d-b1b0-4696-a17a-d60a7dadef67",
      },
    ],
  },
  {
    id: "cat-ac",
    name: "AC & Cooling",
    description: "Air conditioning repair, servicing, and installation",
    services: [
      {
        id: "svc-003",
        name: "AC Repair & Servicing",
        price: 1500,
        technicianId: "4b24fde1-7516-43e4-856a-d13a2437aff2",
      },
      {
        id: "svc-004",
        name: "AC Installation",
        price: 3500,
        technicianId: "616baf2d-b1b0-4696-a17a-d60a7dadef67",
      },
    ],
  },
  {
    id: "cat-plumbing",
    name: "Plumbing",
    description: "Leak fixes, pipe repairs, and bathroom fittings",
    services: [
      {
        id: "svc-005",
        name: "Plumbing Leak Fix",
        price: 1200,
        technicianId: "tech-003",
      },
      {
        id: "svc-006",
        name: "Kitchen Sink Repair",
        price: 900,
        technicianId: "tech-003",
      },
    ],
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bk-101",
    customerId: "usr-001",
    customer: MOCK_USERS[0],
    technicianId: "4b24fde1-7516-43e4-856a-d13a2437aff2",
    technician: MOCK_TECHNICIANS[0],
    serviceId: "svc-003",
    service: {
      id: "svc-003",
      name: "AC Repair & Servicing",
      price: 1500,
      technicianId: "4b24fde1-7516-43e4-856a-d13a2437aff2",
      categoryName: "AC & Cooling",
    },
    scheduledAt: "2026-05-12T10:00:00Z",
    address: "House 12, Road 5, Gulshan, Dhaka",
    notes: "Living room AC not cooling properly",
    totalAmount: 1500,
    status: "COMPLETED",
    createdAt: "2026-05-01T08:00:00Z",
    updatedAt: "2026-05-12T12:00:00Z",
  },
  {
    id: "bk-102",
    customerId: "usr-001",
    customer: MOCK_USERS[0],
    technicianId: "616baf2d-b1b0-4696-a17a-d60a7dadef67",
    technician: MOCK_TECHNICIANS[1],
    serviceId: "svc-004",
    service: {
      id: "svc-004",
      name: "AC Installation",
      price: 3500,
      technicianId: "616baf2d-b1b0-4696-a17a-d60a7dadef67",
      categoryName: "AC & Cooling",
    },
    scheduledAt: "2026-05-18T14:30:00Z",
    address: "Flat 4B, Banani, Dhaka",
    totalAmount: 3500,
    status: "ACCEPT",
    createdAt: "2026-05-05T10:00:00Z",
    updatedAt: "2026-05-06T09:00:00Z",
  },
  {
    id: "bk-201",
    customerId: "usr-002",
    customer: MOCK_USERS[1],
    technicianId: "tech-003",
    technician: MOCK_TECHNICIANS[2],
    serviceId: "svc-005",
    service: {
      id: "svc-005",
      name: "Plumbing Leak Fix",
      price: 1200,
      technicianId: "tech-003",
      categoryName: "Plumbing",
    },
    scheduledAt: "2026-05-20T11:00:00Z",
    address: "Sector 7, Uttara, Dhaka",
    notes: "Bathroom pipe leaking",
    totalAmount: 1200,
    status: "PENDING",
    createdAt: "2026-05-15T14:00:00Z",
    updatedAt: "2026-05-15T14:00:00Z",
  },
  {
    id: "bk-202",
    customerId: "usr-003",
    customer: MOCK_USERS[2],
    technicianId: "tech-003",
    technician: MOCK_TECHNICIANS[2],
    serviceId: "svc-006",
    service: {
      id: "svc-006",
      name: "Kitchen Sink Repair",
      price: 900,
      technicianId: "tech-003",
      categoryName: "Plumbing",
    },
    scheduledAt: "2026-05-15T16:00:00Z",
    address: "Mirpur DOHS, Dhaka",
    totalAmount: 900,
    status: "COMPLETED",
    createdAt: "2026-05-10T11:00:00Z",
    updatedAt: "2026-05-15T18:00:00Z",
  },
  {
    id: "bk-301",
    customerId: "usr-002",
    customer: MOCK_USERS[1],
    technicianId: "4b24fde1-7516-43e4-856a-d13a2437aff2",
    technician: MOCK_TECHNICIANS[0],
    serviceId: "svc-001",
    service: {
      id: "svc-001",
      name: "Apartment Moving",
      price: 4000,
      technicianId: "4b24fde1-7516-43e4-856a-d13a2437aff2",
      categoryName: "Moving Service",
    },
    scheduledAt: "2026-06-01T09:00:00Z",
    address: "Mohakhali to Bashundhara, Dhaka",
    totalAmount: 4000,
    status: "PENDING",
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-05-20T09:00:00Z",
  },
  {
    id: "bk-302",
    customerId: "usr-003",
    customer: MOCK_USERS[2],
    technicianId: "616baf2d-b1b0-4696-a17a-d60a7dadef67",
    technician: MOCK_TECHNICIANS[1],
    serviceId: "svc-002",
    service: {
      id: "svc-002",
      name: "Office Relocation",
      price: 8000,
      technicianId: "616baf2d-b1b0-4696-a17a-d60a7dadef67",
      categoryName: "Moving Service",
    },
    scheduledAt: "2026-06-10T08:00:00Z",
    address: "Motijheel to Gulshan, Dhaka",
    totalAmount: 8000,
    status: "ACCEPT",
    createdAt: "2026-05-22T10:00:00Z",
    updatedAt: "2026-05-23T08:00:00Z",
  },
];

export const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { month: "Jan", revenue: 12500, bookings: 8 },
  { month: "Feb", revenue: 18200, bookings: 12 },
  { month: "Mar", revenue: 15800, bookings: 10 },
  { month: "Apr", revenue: 22400, bookings: 15 },
  { month: "May", revenue: 28900, bookings: 19 },
  { month: "Jun", revenue: 19600, bookings: 13 },
];

export const CURRENT_USER = MOCK_USERS[0];

export const CURRENT_TECHNICIAN = MOCK_TECHNICIANS[0];

export function getTechnicianName(id: string): string {
  return MOCK_TECHNICIANS.find((t) => t.id === id)?.user?.name ?? "Unknown";
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
