# Changelog

## Phase 2 — Conversion & Trust Redesign (P0 + P1)

Implements the P0/P1 findings from the pathologymcq.com audit
(`pathologymcq_serious_website_audit_and_redesign_proposal.md`, Phase 5 log #1–9).
P2/P3 items and anything depending on features not yet built (quiz, checkout, blog)
are deferred to their own future phases — see the plan for details.

| # | Audit finding | Status | Files/components |
| :-- | :-- | :-- | :-- |
| 1 | Direct course links hit a login wall | **Fixed** | `components/marketing/course-card.tsx`, `app/courses/page.tsx`, `app/courses/[slug]/page.tsx` — every course entry point links to the public course page; no auth check on the page itself, enrollment is the only auth boundary |
| 2 | "GO TO YOUR" menu label is confusing | **Fixed** | `components/layout/navbar.tsx` — replaced with an explicit "Courses" dropdown (`components/ui/dropdown-menu.tsx`) listing FRCPath Part 1/2, NEET-SS/Oncopathology, Hematopathology, Mock Tests |
| 3 | Samples and pricing fragmented across pages | **Fixed** | `app/courses/[slug]/page.tsx` consolidates hero, who-it's-for, what-you-get, curriculum, an inline sample question (`components/marketing/sample-preview.tsx`), faculty, testimonials, pricing, and FAQ on one page |
| 4 | Faculty credentials not visible on homepage | **Fixed** | `app/page.tsx` moves `FacultyBand` higher (`id="faculty"`), linked directly from nav and footer |
| 5 | Free quizzes lack upsell CTAs | **Deferred** | No quiz engine exists yet — lands with the Quiz phase |
| 6 | Small mobile touch targets, generic spacing | **Addressed** | `size="lg"` (56px) CTAs throughout; dedicated mobile-first sticky enroll widget, `components/course/sticky-enroll-bar.tsx` |
| 7 | Basic WordPress-template aesthetic | **Addressed in Phase 1** | Design tokens + component library already replaced this; Phase 2 extends the same system, no new design debt |
| 8 | Checkout lacks trust badges | **Deferred** | No checkout exists yet — lands with the Checkout phase |
| 9 | Missing schema for rich snippets | **Fixed** | `Course`/`Offer` + `FAQPage` JSON-LD on `app/courses/[slug]/page.tsx` and `app/faq/page.tsx` |

### New routes
- `/courses` — public course listing, filterable via `?exam=<category>`
- `/courses/[slug]` — consolidated course sales page
- `/faq` — dedicated FAQ page with schema

### New shared components
`components/ui/accordion.tsx`, `components/ui/dropdown-menu.tsx`,
`components/marketing/{exam-pathway-card,sample-preview,post-card,faq-section,whatsapp-button,practice-teaser}.tsx`,
`components/course/{course-hero,course-curriculum,course-pricing-card,sticky-enroll-bar}.tsx`.

### Data model
Extended `Course` (`lib/api/types.ts`) with `category`, `tagline`, `whoFor`, `whatYouGet`,
`curriculum`, `faqs`; added `getCourseBySlug`/`getAllCourseSlugs`/`getAllCourses`/`getRecentPosts`
to `lib/api/content.ts` — same fetch-with-mock-fallback pattern as Phase 1.
