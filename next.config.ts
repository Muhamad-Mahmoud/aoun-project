import type { NextConfig } from "next";
import "./src/env"; //  CRITICAL: Force Env Validation on Build/Start

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Security checks
  productionBrowserSourceMaps: false, //  CRITICAL: Never expose source code in production

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self'; 
              script-src 'self' 'unsafe-inline'; 
              style-src 'self' 'unsafe-inline'; 
              img-src 'self' data: blob: https://api.dicebear.com https://aoun-api.runasp.net ${isProd ? '' : 'http://localhost:5204 http://127.0.0.1:5204 https://localhost:7189 https://127.0.0.1:7189'}; 
              font-src 'self' data:; 
              frame-ancestors 'none'; 
              connect-src 'self' https://aoun-api.runasp.net https://muhammadmahmoud-awn-ai-service.hf.space ${isProd ? '' : 'http://localhost:5204 http://127.0.0.1:5204 https://localhost:7189 https://127.0.0.1:7189 http://127.0.0.1:8000 http://localhost:8000'};
            `.replace(/\s+/g, " ").trim(),
          },
        ],
      },
    ];
  },
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "aoun-api.runasp.net",
      },
      ...(!isProd ? [
        { protocol: "http" as const, hostname: "localhost", port: "5204" },
        { protocol: "http" as const, hostname: "127.0.0.1", port: "5204" },
        { protocol: "https" as const, hostname: "localhost", port: "7189" },
        { protocol: "https" as const, hostname: "127.0.0.1", port: "7189" },
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
  // Disable dev indicators to prevent overlay injections on mobile
  devIndicators: false,
};

export default nextConfig;
