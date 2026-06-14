import type { MetadataRoute } from "next";

const routes = [
  "",
  "/how-it-works",
  "/services",
  "/industries",
  "/results",
  "/about",
  "/contact",
  "/get-started",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kravex.co.uk";
  const lastModified = new Date();

  return routes.map((route, index) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/get-started" ? 0.9 : 0.7,
  }));
}
