import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/public/page-header";
import { RoomCard } from "@/components/public/room-card";
import { Reveal } from "@/components/public/reveal";
import { getRoomCards } from "@/lib/rooms";
import { ROOM_CATEGORIES, ROOM_CATEGORY_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Daftar Kamar",
  description:
    "Lihat daftar kamar Yasmine Kost beserta harga, fasilitas, dan ketersediaan.",
};

type SearchParams = Promise<{ kategori?: string; status?: string }>;

export default async function KamarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const category =
    sp.kategori && ROOM_CATEGORIES.includes(sp.kategori as never)
      ? sp.kategori
      : undefined;
  const availableOnly = sp.status === "tersedia";

  const rooms = await getRoomCards({ category, availableOnly });

  const buildHref = (params: Record<string, string | undefined>) => {
    const merged = {
      kategori: category,
      status: availableOnly ? "tersedia" : undefined,
      ...params,
    };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    const str = qs.toString();
    return str ? `/kamar?${str}` : "/kamar";
  };

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-muted-foreground hover:text-foreground"
    );

  return (
    <>
      <PageHeader
        title="Daftar Kamar"
        description="Pilih kamar yang sesuai dengan kebutuhanmu, lalu booking secara online."
      />
      <div className="container py-10">
        {/* Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref({ kategori: undefined })} className={chip(!category)}>
              Semua
            </Link>
            {ROOM_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={buildHref({ kategori: c })}
                className={chip(category === c)}
              >
                {ROOM_CATEGORY_LABEL[c]}
              </Link>
            ))}
          </div>
          <Link
            href={buildHref({ status: availableOnly ? undefined : "tersedia" })}
            className={chip(availableOnly)}
          >
            Hanya yang tersedia
          </Link>
        </div>

        {/* Results */}
        {rooms.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, i) => (
              <Reveal key={room.id} delay={Math.min(i, 7) * 70} className="h-full">
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            Tidak ada kamar yang cocok dengan filter ini.
          </p>
        )}
      </div>
    </>
  );
}
