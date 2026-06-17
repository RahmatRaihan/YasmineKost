import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPaths = [
    "",
    "/kamar",
    "/fasilitas",
    "/lokasi",
    "/peraturan",
    "/kontak",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  let roomPaths: MetadataRoute.Sitemap = [];
  try {
    const rooms = await prisma.room.findMany({ select: { id: true, updatedAt: true } });
    roomPaths = rooms.map((r) => ({
      url: `${base}/kamar/${r.id}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB belum siap saat build — abaikan.
  }

  return [...staticPaths, ...roomPaths];
}
