# Blog + In-Place Editing — Setup

A WordPress-style editing layer, backed by **Supabase**. Normal visitors see a
clean blog. The admin logs in with **static credentials** (from env) and gets
in-place editing with a **Colab-style draggable block editor** and a **Preview**
toggle.

## Architecture (how auth works)
- **Admin login** is static: `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env.local`.
  A successful login sets a signed, httpOnly cookie (signed with
  `ADMIN_SESSION_SECRET`). No Supabase user accounts needed.
- **Writes** (create/edit/delete posts & categories, image upload) go through
  server routes under `/api/admin/*` that check the admin cookie and then use
  the Supabase **service-role key** (server-only). The service-role key is never
  sent to the browser.
- **Public reads** use the Supabase **anon key** and only ever return published
  posts (enforced by row-level security).

## 1. Create a Supabase project
1. <https://supabase.com> → create a project.
2. Project Settings → **API** → copy **Project URL**, **anon public** key, and
   **service_role** key (under "Project API keys").

## 2. Run the database migration
Supabase dashboard → **SQL Editor** → paste and run:
```
supabase/migrations/0001_blog.sql
```
Creates `categories`, `posts`, a public `blog` storage bucket, and RLS policies.

## 3. Configure env
```bash
cp .env.local.example .env.local
```
Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...            # anon public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...                # service_role key (server only)

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123                          # change before going live
ADMIN_SESSION_SECRET=<64-char random hex>        # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Restart `npm run dev` after any env change.

## 4. Run
```bash
npm install      # first time only (adds @supabase/supabase-js + @dnd-kit)
npm run dev
```

## How to use it
- Visit **`/blog`** — the public blog (empty until you add posts).
- Go to **`/admin/login`** and sign in with `ADMIN_USERNAME` + `ADMIN_PASSWORD`.
- A floating **admin bar** appears (bottom center) with **Edit / Preview** and
  sign-out.
  - **Edit**: `/blog` shows *Add category* and *New blog post*. Opening a post
    shows the block editor.
  - **Preview**: renders every page exactly as a normal visitor sees it, while
    you stay signed in.

### The editor
- Each post is a stack of **cells** (Text, Heading, Image, Quote, Divider).
- **Drag** the handle (⋮⋮, appears on hover) to reorder cells.
- Per-cell toolbar: **align** left/center/right, set **width** (25–100%),
  choose heading level, upload images, or delete.
- **Save** keeps it a draft; **Publish** makes it public. Drafts are only
  visible to the signed-in admin.

## Notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` secret — server only.
- The site's existing `/login` (student/WordPress auth) is untouched; admin
  editing is a separate static login at `/admin/login`.
