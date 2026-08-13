# API Integration

This document maps the backend REST API endpoints used in this application to the frontend Next.js server actions and UI components that consume them.

## Authentication & Authorization

| Endpoint | HTTP Method | Frontend Action / Service | UI Component(s) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/authlogin/login` | `POST` | `loginUser` (`loginfuntion.ts`) | `LoginCard.tsx` | Authenticates a user and returns JWT tokens. |
| `/api/auth/register` | `POST` | `RegistrationHandle` (`Registration.ts`) | `RegistratioCard.tsx` | Registers a new user account. |
| `/api/authlogin/refresh-token` | `POST` | `proxy.ts`, `refreshAccessToken` (`loginfuntion.ts`), `axios.ts` | Global / Interceptors | Uses refresh token to get a new access token. |
| `/api/auth/me` | `GET` | `getTechnicianProfileAction` (`technicianAction.ts`) | Dashboard Layouts / Profile | Retrieves the authenticated user's profile information. |

## Services

| Endpoint | HTTP Method | Frontend Action / Service | UI Component(s) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/services` | `GET` | `getServicesAction` (`serviceAction.ts`) | `ServicesGrid.tsx` / `page.tsx` | Fetches a list of all available services. |
| `/api/services/:id` | `GET` | `getServiceByIdAction` (`serviceAction.ts`) | `page.tsx` (Service Details) | Fetches details for a specific service by ID. |

## Bookings (Customer)

| Endpoint | HTTP Method | Frontend Action / Service | UI Component(s) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/bookings` | `POST` | `createBookingAction` (`bookingAction.ts`) | `BookingForm` / `page.tsx` | Creates a new booking appointment. |
| `/api/bookings` | `GET` | `getMyBookingsAction` (`bookingAction.ts`) | `CustomerDashboard` / `page.tsx` | Retrieves all bookings for the logged-in customer. |

## Payments

| Endpoint | HTTP Method | Frontend Action / Service | UI Component(s) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/payments/checkout` | `POST` | `createCheckoutSessionAction` (`bookingAction.ts`) | `PaymentSubscription` / `Checkout` | Initiates a Stripe checkout session for a booking. |

## Technician Portal

| Endpoint | HTTP Method | Frontend Action / Service | UI Component(s) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/technician/profile` | `PUT` | `becomeTechnicianAction`, `updateTechnicianProfileAction` | `BecomeTechnicianForm`, `ProfileEdit` | Creates or updates the technician's public profile. |
| `/api/technician/profile` | `GET` | `getTechnicianProfileAction` (`technicianAction.ts`) | `TechnicianDashboard` | Fetches the logged-in technician's profile data. |
| `/api/technician/availability` | `PUT` | `updateTechnicianAvailabilityAction` | `AvailabilityToggle` | Toggles the technician's availability status. |
| `/api/technician/bookings` | `GET` | `getTechnicianBookingsAction` | `TechnicianDashboard` | Fetches all bookings assigned to the technician. |
| `/api/technician/bookings/:id` | `PATCH` / `PUT` | `updateTechnicianBookingStatusAction` | `BookingActionButtons` | Updates the status of a specific booking (e.g., accepted, completed). |
