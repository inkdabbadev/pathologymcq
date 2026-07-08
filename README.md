# Pathology MCQ — headless front-end

Premium Next.js front-end for pathologymcq.com. This is a **headless client for an
existing WordPress + WooCommerce + Tutor LMS install** — courses, quizzes, products,
orders, users and payments live in WordPress; this app consumes them via APIs.

## Status: Phase 1 (Foundation)

This pass delivers the app shell, design system, the first slice of the reusable
component library, a typed API layer, and a fully built Home page — all running on
**mock/seed data** (`lib/mock/*`), since no WordPress backend is connected yet.
Every function in `lib/api/*` fails closed to mock content, so the app renders with
zero configuration.

Not yet built (planned as their own follow-up phases, per the build spec's execution
order): `/courses`, `/practice`, `/quiz`, `/mock-tests`, `/shop`, `/cart`,
`/checkout`, `/account`, `/dashboard`, `/blog`, auth pages, and the microscopy
lightbox.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Home page renders fully on
mock data with no `.env` file required.

To connect a real WordPress backend later, copy `.env.example` to `.env.local` and
set `NEXT_PUBLIC_WP_URL` (plus the WooCommerce/Tutor/JWT vars once those phases are
wired up).

## Architecture

- **Next.js 16 (App Router), TypeScript, React 19** — see `AGENTS.md` for
  version-specific breaking changes (Middleware is now `proxy.ts`, `params`/
  `searchParams` are Promises, etc.) sourced from `node_modules/next/dist/docs`.
- **Tailwind CSS v4**, CSS-first config — design tokens live in `app/globals.css`
  under `:root` (H&E palette, spacing scale, shadows) and are mapped into Tailwind
  utilities via the `@theme` block. No `tailwind.config.js`.
- **Fonts**: Poppins (display/headings) + Inter (body/UI) via `next/font/google`,
  wired in `app/layout.tsx`.
- **Component library**: `components/ui/*` (Button, Container, Section, Badge,
  Avatar — restyled Radix/shadcn-pattern primitives), `components/layout/*`
  (Navbar, Footer), `components/marketing/*` (Hero, StatBand, CourseCard,
  FeatureCard, TestimonialCard, FacultyBand, CtaBand), `components/motion/reveal.tsx`
  (scroll-reveal wrapper, respects `prefers-reduced-motion`).
- **Typed API layer**: `lib/api/types.ts` (shared types), `lib/api/client.ts`
  (WPGraphQL fetch wrapper — classic `fetch` caching via `next: { revalidate, tags }`,
  returns `null` on failure instead of throwing), `lib/api/content.ts` (typed
  fetchers with mock fallback). `lib/mock/*` holds the seed content.
- **Caching model**: classic Next.js fetch-cache + `revalidateTag`, not the newer
  opt-in Cache Components (`use cache`) model — kept simple while breadth is still
  being built out across pages.

## Required WordPress plugins (for when a real backend is connected)

- WPGraphQL
- WPGraphQL for WooCommerce (WooGraphQL)
- WPGraphQL JWT Authentication
- Tutor LMS (REST API)

## Deploying

Vercel (front-end) + your existing WordPress host (backend). Payment flows
(Razorpay/Stripe/PhonePe/Paystack) stay on the WooCommerce side — this app never
reimplements scoring, enrollment, or payment logic, only calls the WP APIs.
