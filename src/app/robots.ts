import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://aounn.runasp.net";

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

