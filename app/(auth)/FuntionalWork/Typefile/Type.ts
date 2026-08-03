export type RegUserType = {
  name: string;
  email: string;
  password: string;
  photo?: string;
  number: string;
  confirmPassword: string;
  role: "CUSTOMER" | "TECHNICIAN";
  // Technician-only fields (only required when role === "TECHNICIAN")
  experienceYrs?: number;
  hourlyRate?: number;
  city?: string;
  address?: string;
};
