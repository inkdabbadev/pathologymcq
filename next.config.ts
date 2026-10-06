import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "swowjsnvczqkklmtokgl.supabase.co";

const nextConfig: NextConfig = {
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
