import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://aoun.org";

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

