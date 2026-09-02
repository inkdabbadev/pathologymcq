"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (singleton).
 *
 * Returns null when env vars are missing so the rest of the site keeps working
 * without a configured backend — blog/admin surfaces show a "connect Supabase"
 * notice instead of crashing.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    cached = null;
    return cached;
  }

  cached = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
