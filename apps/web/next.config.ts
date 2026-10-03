import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADR-001: static export — portable, fast, free to host anywhere
  output: "export",
  // Required for Cloudflare Pages static hosting
  trailingSlash: true,
  // Required for static export — no image optimisation server
  images: {
    unoptimized: true,
  },
  // Headers are handled by Cloudflare Pages via public/_headers for static export
};

export default nextConfig;
