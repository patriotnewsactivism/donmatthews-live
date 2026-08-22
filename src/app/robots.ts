import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/new"],
    },
    sitemap: "https://donmatthews.live/sitemap.xml",
    host: "https://donmatthews.live",
  };
}
