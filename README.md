# Fix It Now

Fix It Now is a responsive Next.js 16 website for home service booking, repairs, and subscription-based AC maintenance. The app uses React, Tailwind CSS, GSAP animations, and client/server hooks to deliver a polished booking experience across desktop and mobile.

## What’s Included

- `app/page.tsx` — landing page with hero, service grid, why-us section, pricing, emergency CTA, testimonials, FAQ, and footer
- `app/service/page.tsx` — service marketplace with filtering, dynamic service cards, mobile-friendly sidebar, and search overlay
- `app/about/page.tsx` — about/feature story section with responsive imagery and statistics
- `app/booking/page.tsx` — booking workflow and service cards with responsive layout
- `app/dashboard/*` — authenticated user dashboard pages for admin, customer, and technician views
- `components/` — reusable UI sections, responsive hero/banner, testimonials, footer, FAQ, pricing, and service cards
- `lib/` — helper actions, Axios instance, auth utilities, and query provider

## Responsive Improvements

This repository includes responsive fixes for mobile and tablet layouts. Key changes include:

- root page wrappers set to `w-full max-w-full sm:max-w-...` to avoid overly narrow mobile layouts
- global body overflow hidden to prevent horizontal scroll from decorative absolute elements
- responsive Tailwind classes on major sections so grids collapse on small screens and hero content stacks vertically

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Notes

- This app uses `next/image` for optimized images and `gsap` for scroll-triggered animations.
- The project uses Tailwind CSS via `@tailwindcss/postcss` and `shadcn` UI components.
- If you add new page sections, use responsive Tailwind utilities such as `sm:`, `md:`, and `lg:` to ensure layout works across devices.
