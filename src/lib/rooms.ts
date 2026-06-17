import { prisma } from "@/lib/prisma";
import type { RoomCardData } from "@/components/public/room-card";

type RoomFilter = {
  category?: string;
  availableOnly?: boolean;
  take?: number;
};

/** Ambil daftar kamar untuk kartu publik (dengan foto utama). */
export async function getRoomCards(
  filter: RoomFilter = {}
): Promise<RoomCardData[]> {
  const rooms = await prisma.room.findMany({
    where: {
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.availableOnly ? { status: "AVAILABLE" } : {}),
    },
    include: {
      photos: { orderBy: { sort: "asc" }, take: 1 },
    },
    orderBy: [{ status: "asc" }, { number: "asc" }],
    ...(filter.take ? { take: filter.take } : {}),
  });

  return rooms.map((r) => ({
    id: r.id,
    number: r.number,
    name: r.name,
    category: r.category,
    monthlyPrice: r.monthlyPrice,
    status: r.status,
    privateBath: r.privateBath,
    hasAC: r.hasAC,
    photo: r.photos[0]?.url ?? null,
  }));
}

/** Rentang harga (termurah & termahal) untuk ditampilkan di beranda. */
export async function getPriceRange() {
  const agg = await prisma.room.aggregate({
    _min: { monthlyPrice: true },
    _max: { monthlyPrice: true },
  });
  return { min: agg._min.monthlyPrice ?? 0, max: agg._max.monthlyPrice ?? 0 };
}
