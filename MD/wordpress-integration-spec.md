# PathologyMCQ — Next.js ↔ WordPress Integration Spec

**Purpose:** Connect the newly built Next.js front-end to the existing WordPress backend at `pathologymcq.com`, starting with authentication, then gated features (course content + enrollment access).
**Status:** Architecture confirmed by live inspection. Build not yet started.
**Audience:** The developer implementing the integration.

---

## 0. TL;DR — what we're doing and why

The Next.js app was originally written against a **GraphQL** endpoint (`/graphql`) that **does not exist** on the site. Every data fetcher silently falls back to mock data because of a fail-closed-to-mock design. We inspected the live backend and decided to **integrate over REST instead of GraphQL**, because:

- WPGraphQL / WooGraphQL are **not installed**, and the host (WordPress.com Atomic) may not allow installing them.
- The hardest custom piece — **enrollment access checking** — already exists as a **REST** endpoint (`custom-tutor/v1`). Building it in GraphQL would mean writing custom resolvers for Tutor LMS, which has no maintained GraphQL layer.
- The full REST surface we need is already present and mostly active.

**Build order (decided): auth first, then gated features.**
**Token storage (decided): httpOnly cookie, proxied through Next.js route handlers.** The browser never calls WordPress directly for authenticated requests.

---

## 1. Confirmed backend facts (from live inspection)

Site: `pathologymcq.com` · Blog ID `191175737` · Platform: WordPress.com **Atomic** (SSH/SFTP capable).

### 1.1 Data model — courses are sold as WooCommerce products
- Course content (lessons, topics, quizzes, progress) lives in **Tutor LMS**.
- Catalog + pricing lives in **WooCommerce**. Courses appear as WooCommerce products (confirmed: product `id: 85331`, "Advanced Hematopathology Course", `type: simple`).
- This is Tutor's standard **WooCommerce monetization** mode.

### 1.2 Access model — Tutor enrollment is the source of truth
- Flow: **WooCommerce purchase → writes Tutor enrollment → app checks enrollment.**
- The check is done via the custom `custom-tutor/v1` endpoints (purpose-built by the site's plugin author).

### 1.3 The auth boundary (verified by status codes)
| Endpoint | Auth needed | Observed |
|---|---|---|
| `wc/store/v1/products` | **None (public)** | `200` + real product data |
| `tutor/v1/courses` | **Yes** | `401 rest_forbidden` when unauthenticated |
| `custom-tutor/v1/courses` | **Yes** | `401 rest_forbidden` when unauthenticated |

**Implication:** the entire logged-out catalog/shop experience can be built with **zero auth** against the WooCommerce Store API. Auth (JWT) is only required for personal/gated data.

### 1.4 Available REST namespaces (relevant subset)
- `wc/v1`, `wc/v2`, `wc/v3` — WooCommerce core REST
- `wc/store`, `wc/store/v1` — **public** Store API (catalog, no auth)
- `tutor/v1` — full Tutor REST: `courses`, `courses/{id}`, `topics`, `lessons`, `quizzes`, `quiz-questions`, `quiz-attempts`, `course-contents/{id}`, `course-mark-complete`, `lesson-mark-complete`, `assignments`, `assignment-submit`, `author-information/{id}`, `course-rating/{id}`, etc.
- `custom-tutor/v1` — **custom enrollment plugin**, exactly three routes:
  - `POST /custom-tutor/v1/enroll`
  - `POST /custom-tutor/v1/unenroll`
  - `GET  /custom-tutor/v1/courses` (returns the authenticated user's enrolled courses)
- `product` is a registered post type (`rest_base: product`).

### 1.5 Relevant plugins & their state
- **WooCommerce** 10.9.4 — active
- **Tutor LMS** 3.9.15 + **Tutor LMS Pro** — active
- **JWT Authentication for WP-API** (`jwt-authentication-for-wp-rest-api/jwt-auth`) — **INACTIVE** (must activate)
- **TutorLMS Course Access Checker** (custom) — inactive (optional; `custom-tutor/v1` already covers our needs)
- **Tutor LMS Enroller-n8n** (custom, provides `custom-tutor/v1`) — active
- Payment gateways (Razorpay, Stripe, WooPayments, PhonePe) — active; **checkout is server-side in WooCommerce, not called from the front-end.**
- Content protection (CopySafe, Secure Copy Content Protection) — active; reinforces the case for httpOnly token storage.

**Not installed:** WPGraphQL, WooGraphQL, wp-graphql-jwt-authentication. Do not assume any `/graphql` endpoint.

---

## 2. Architecture to build

### 2.1 Core principle — Next.js as an auth proxy (BFF)
The browser talks only to **same-origin Next.js route handlers**. Those handlers hold the httpOnly cookie, attach the JWT as a `Bearer` header, and call WordPress server-to-server. The raw token is **never** exposed to client JS and never placed in a URL.

```
Browser (React)
   │  same-origin fetch, cookie sent automatically
   ▼
Next.js Route Handlers (/api/auth/*, /api/courses/*)   ← httpOnly cookie lives here
   │  server-to-server, Authorization: Bearer <jwt>
   ▼
WordPress REST (jwt-auth/v1, tutor/v1, custom-tutor/v1)
```

Public catalog calls (`wc/store/v1/products`) may go **browser-direct**, since they need no token. Everything authenticated goes through the proxy.

### 2.2 Why httpOnly + proxy (not localStorage)
- The JWT is effectively a key to paid content. localStorage is readable by any injected script (XSS) → token theft. httpOnly cookies are invisible to JS.
- Proxying also sidesteps cross-origin CORS fragility: the browser only ever hits same-origin routes; WP calls happen server-side.

### 2.3 Cookie flags
`httpOnly: true`, `secure: true`, `sameSite: 'lax'`, `path: '/'`, `maxAge` aligned to JWT expiry. Name e.g. `pmcq_session`.

---

## 3. Prerequisites (WordPress side — must happen before code can be tested)

> The person owning the site must do the credential steps; these cannot be done by an assistant that can't handle secrets.

### 3.1 Activate the JWT plugin
Activate **JWT Authentication for WP-API**. This registers:
- `POST /wp-json/jwt-auth/v1/token` (issue token)
- `POST /wp-json/jwt-auth/v1/token/validate` (validate token)

### 3.2 Add secret + CORS to `wp-config.php`
Above the `/* That's all, stop editing! */` line. Generate a secret from a WordPress salt generator (`https://api.wordpress.org/secret-key/1.1/salt/`):
```php
define('JWT_AUTH_SECRET_KEY', '<long-random-string>');
define('JWT_AUTH_CORS_ENABLE', true);
```

### 3.3 Authorization header pass-through
Apache/`.htaccess` (above `# BEGIN WordPress`):
```
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```
**Note for this host:** WordPress.com Atomic is nginx-fronted; the `Authorization` header may already pass through, making this step unnecessary. **Verify by test** (§5): if `/token` issues a token but later authenticated calls 401, it's the header. Don't guess at server internals.

---

## 4. Route handlers to implement (Next.js `app/api/...`)

All handlers read `WP_URL` from env (server-only, e.g. `WP_API_BASE=https://pathologymcq.com/wp-json`). Never expose it as `NEXT_PUBLIC_` for authenticated calls.

| Route | Method | Calls WP | Responsibility |
|---|---|---|---|
| `/api/auth/login` | POST | `jwt-auth/v1/token` | Take username+password, get token, set httpOnly cookie, return safe user info (**never** the raw token) |
| `/api/auth/logout` | POST | — | Clear the cookie |
| `/api/auth/me` | GET | `jwt-auth/v1/token/validate` | Validate current cookie; return user or 401 |
| `/api/courses/access` | GET | `custom-tutor/v1/courses` | Enrollment gate — list the user's enrolled courses |
| `/api/courses/[id]/content` | GET | `tutor/v1/course-contents/{id}` | Gated course content (only if enrolled) |

Enrollment gate logic: call `custom-tutor/v1/courses` with the bearer token; the returned enrolled-course set decides access to `/mock-tests`, `/my-courses`, and course players.

---

## 5. Verification checklist (do before building UI on top)
1. `POST /wp-json/jwt-auth/v1/token` with a real test account → returns a token. ✅ = plugin + secret OK.
2. Call `GET /wp-json/custom-tutor/v1/courses` with `Authorization: Bearer <token>` → returns that user's enrolled courses (not 401). ✅ = header pass-through OK **and** enrollment gate works end-to-end.
3. Call the same without the header → expect `401`. ✅ = gate actually gates.
4. Confirm `wc/store/v1/products` still returns `200` unauthenticated → public catalog path OK.

---

## 6. Front-end client changes
- Rewrite `lib/api/client.ts`: drop GraphQL POSTs to `/graphql`; call same-origin `/api/*` routes for authenticated data and `wc/store/v1` for public catalog.
- Rewrite the data fetchers accordingly (courses list → Store API products; course content → `/api/courses/[id]/content`; enrollment → `/api/courses/access`).
- **Add a visible MOCK-vs-LIVE dev signal** (console warning + a non-prod on-screen "MOCK" badge). The existing fail-to-mock design hides misconfiguration: once a real backend is wired, a failed real fetch currently looks identical to intended mock mode. Make the distinction visible in dev.
- Decide the fate of `react-query` (installed, unwired): either adopt it for the client-side authenticated calls or remove it to avoid implying patterns that don't exist.

---

## 7. Explicitly out of scope for this phase
- **Payments** — checkout stays server-side in WooCommerce (redirect to Woo checkout or Store API cart). Never put gateway keys in front-end code.
- **QSM quizzes, OpenSeadragon viewers, AI-feedback plugins** — these render via WordPress shortcodes/pages; either embed or rebuild natively later. Not REST integrations.
- **The MCQ practice engine** — currently self-contained on 140 mock questions. Decide separately whether these migrate into WordPress or stay app-side.
- **SEO / analytics / email plugins** — backend/admin tools; nothing for the front-end to connect to.

---

## 8. Known risks / watch-items
- **Slide viewer coordinates** (from the original handoff): 4 of 5 regions calibrated against an unverified source resolution. Must-verify before launch — it's the signature feature on a pathology site.
- **Silent mock fallback** — addressed by the dev signal in §6; keep it.
- **Content-protection plugins** may interfere with how content is delivered to a headless client; watch once live.
- **Atomic host constraints** — plugin installs from outside the marketplace may be restricted; this is why we chose the REST path that needs no new plugins beyond activating JWT.
- **Auth header on Atomic** — see §3.3; confirm by test, not assumption.

---

## 9. Immediate next action
Activate the **JWT Authentication for WP-API** plugin, then complete §3.2 (secret) and run the §5 verification. Once step 2 of the checklist passes, build the route handlers in §4 and rewire the client in §6.
