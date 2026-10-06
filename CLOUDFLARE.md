# Cloudflare Workers deployment

This repository uses Next.js 16.3.8 with pinned OpenNext and Wrangler versions. The Worker entry point and static assets are configured in `wrangler.jsonc` following the [OpenNext setup guide](https://opennext.js.org/cloudflare/get-started).

In Cloudflare Workers Builds, use:

- Build command: `npm run build:cloudflare`
- Deploy command: `npm run deploy`

The Wrangler custom build also supports the existing `npx wrangler deploy` command. Do not deploy `.next` as a static Pages directory; the API routes require Workers.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the build environment. Set the same Supabase URL and the server-only `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in the Worker runtime variables/secrets. Never put server secrets in `NEXT_PUBLIC_` variables or committed configuration. Local `.env` files are not uploaded.

## Slide uploads

Regular images and existing DZI packages are uploaded to Supabase through the admin panel as before. Native Sharp processing cannot execute inside a Worker, so image-to-DZI generation runs on your own computer:

```bash
npm run dzi:generate -- /path/to/slide.tiff /path/to/empty-output-folder
```

Then open `/admin/dzi`, choose **Upload DZI folder**, and select that output folder. Sharp remains a development dependency for this command, not an import in the server bundle. Next.js images are served unoptimized so deployment does not require a Cloudflare Images binding.

## Validate locally

```bash
npm ci
npm run build:cloudflare
npm run preview
```

Preview runs the built output in the Workers runtime. Configure local runtime secrets in an ignored `.dev.vars` file when testing authenticated/database flows.
