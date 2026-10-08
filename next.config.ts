import type { NextConfig } from "next";
import migration from "./lib/seo/migration.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "swowjsnvczqkklmtokgl.supabase.co";

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: false,
    webpackBuildWorker: false,
  },
  // Keep database-backed metadata in the initial HTML for crawlers and link
  // preview services instead of appending it in a later streamed chunk.
  htmlLimitedBots: /.*/,
  async redirects() {
    return Object.entries(migration.redirects).map(([source, destination]) => ({
      source: source.replace(/[():*+?{}[\]\\]/g, "\\$&"), destination, statusCode: 301,
    }));
  },
  images: {
    // Serve original images; no native Sharp or paid image binding is required.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
};

export default nextConfig;
