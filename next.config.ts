import type { NextConfig } from "next";
import "./src/env"; //  CRITICAL: Force Env Validation on Build/Start

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Security checks
  productionBrowserSourceMaps: false, //  CRITICAL: Never expose source code in production

  // Security headers
  async headers() {
    // CSP connect-src: in production only allow 'self' (all calls go through /api/proxy).
    // In development, allow direct local backend access for easier debugging.
    const devBackends = !isProd
      ? 'http://aounn.runasp.net https://aounn.runasp.net'
      : '';

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            // Only allow camera/mic if explicitly needed; restrict everything else
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          {
            key: "Content-Security-Policy",
            // connect-src: only 'self' in prod — all API calls go through the Next.js proxy,
            // so the real backend URL is NEVER needed by the browser.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              // Images from DiceBear (avatars) and main API
              `img-src 'self' data: blob: https://api.dicebear.com http://aounn.runasp.net https://aounn.runasp.net`,
              "font-src 'self' data:",
              "frame-ancestors 'none'",
              // Browser only ever connects to its own origin (Next.js proxy handles the rest)
              `connect-src 'self' http://aounn.runasp.net https://aounn.runasp.net ${devBackends}`,
            ].join('; ').replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ];
  },
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Only external image CDNs allowed — backend images served via /api/proxy
      {
        protocol: "https",
        hostname: "api.dicebear.com", // Avatar service
      },
      {
        protocol: "http",
        hostname: "aounn.runasp.net",
      },
      {
        protocol: "https",
        hostname: "aounn.runasp.net",
      },
      // Development-only: local backend direct image access
      ...(!isProd ? [
        { protocol: "http" as const, hostname: "aounn.runasp.net" },
        { protocol: "https" as const, hostname: "aounn.runasp.net" },
      ] : []),
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "sonner",
      "@radix-ui/react-icons",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "@floating-ui/react-dom",
      "react-hook-form",
      "axios",
      "zod",
      "react-markdown",
    ],
  },
  // Remove ALL console logs in production to keep it completely clean
  compiler: {
    removeConsole: isProd,
  },
  // Disable dev indicators to prevent overlay injections on mobile
  devIndicators: false,
};

export default nextConfig;
