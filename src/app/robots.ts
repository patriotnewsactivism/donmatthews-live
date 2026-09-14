import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/new", "/record", "/record/", "/api/record/"],
    },
    sitemap: "https://donmatthews.live/sitemap.xml",
    host: "https://donmatthews.live",
  };
}
