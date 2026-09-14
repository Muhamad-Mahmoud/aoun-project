import type { NextConfig } from "next";
import "./src/env"; //  CRITICAL: Force Env Validation on Build/Start

const isProd = process.env.NODE_ENV === "production";

/**
 * Helper: safely parse a URL and return its origin + hostname/protocol.
 * Returns null if invalid — caller must handle fallback.
 */
function safeParseOrigin(raw: string | undefined): { origin: string; hostname: string; protocol: 'http' | 'https' } | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const protocol = u.protocol === 'http:' ? 'http' as const : 'https' as const;
    return { origin: u.origin, hostname: u.hostname, protocol };
  } catch {
    return null;
  }
}

// Derive allowed backends from env — ZERO hardcoded domains in production
const apiOrigin = safeParseOrigin(process.env.API_URL);
const siteOrigin = safeParseOrigin(process.env.APP_URL || process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL);

const nextConfig: NextConfig = {
  // Security checks
  productionBrowserSourceMaps: false, //  CRITICAL: Never expose source code in production

  // Security headers — production hardened.
  // NOTE: Content-Security-Policy is set DYNAMICALLY per-request in src/proxy.ts
  // (per-request nonce via buildCsp). Do NOT add a static CSP here — duplicate
  // CSP headers AND-combine in browsers and would break pages.
  async headers() {
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
            value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  // Image optimization — derive remotePatterns from env, no hardcoded hosts
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow dicebear always; allow API host dynamically (protocol from env)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      ...(apiOrigin
        ? [{ protocol: apiOrigin.protocol, hostname: apiOrigin.hostname } as const]
        : []),
      // In non-prod, also allow site origin if different from API
      ...(!isProd && siteOrigin && siteOrigin.hostname !== apiOrigin?.hostname
        ? [{ protocol: siteOrigin.protocol, hostname: siteOrigin.hostname } as const]
        : []),
      // Dev-only: localhost for local backend
      ...(!isProd
        ? ([
            { protocol: "http" as const, hostname: "127.0.0.1" },
            { protocol: "http" as const, hostname: "localhost" },
          ] as const)
        : []),
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // optimizePackageImports can add noticeable overhead to Turbopack in dev.
    // Keep it for production bundles only to improve local startup/compile time.
    optimizePackageImports: isProd
      ? [
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
        ]
      : undefined,
  },
  // Remove ALL console logs in production to keep it completely clean
  compiler: {
    removeConsole: isProd,
  },
  // Disable dev indicators to prevent overlay injections on mobile
  devIndicators: false,
};

export default nextConfig;
