import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    process.env.SITE_URL ||
    "https://aounn.runasp.net";

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      // Prevent internal dashboard routes from being indexed
      disallow: ["/dashboard"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

