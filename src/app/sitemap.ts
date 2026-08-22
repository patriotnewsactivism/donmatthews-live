import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://donmatthews.live";
  const lastModified = new Date("2026-08-22T00:00:00-05:00");

  const pages = [
    ["", 1, "weekly"],
    ["/about", 0.8, "monthly"],
    ["/projects", 0.9, "weekly"],
    ["/technology", 0.9, "weekly"],
    ["/american-injustice", 1, "weekly"],
    ["/record", 1, "weekly"],
    ["/music", 0.8, "weekly"],
    ["/press", 0.7, "monthly"],
    ["/updates", 0.9, "weekly"],
    ["/support", 0.6, "monthly"],
    ["/contact", 0.6, "monthly"],
    ["/privacy-policy", 0.3, "yearly"],
    ["/terms", 0.3, "yearly"],
    ["/refund-policy", 0.3, "yearly"],
  ] as const;

  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
