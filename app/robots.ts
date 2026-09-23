import type { MetadataRoute } from "next";

const BASE_URL = "https://normatiza.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/conta"] },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
