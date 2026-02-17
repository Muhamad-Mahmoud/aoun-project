import type { NextConfig } from "next";
import "./src/env"; // 👈 CRITICAL: Force Env Validation on Build/Start

const nextConfig: NextConfig = {
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://api.dicebear.com https://aoun-api.runasp.net http://localhost:5204 http://127.0.0.1:5204; font-src 'self' data:; frame-ancestors 'none'; connect-src 'self' https://aoun-api.runasp.net http://localhost:5204 http://127.0.0.1:5204;",
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
      {
        protocol: "http",
        hostname: "localhost",
        port: "5204",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5204",
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
