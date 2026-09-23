import type { MetadataRoute } from "next";

const BASE_URL = "https://normatiza.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/referencias`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/editor`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
