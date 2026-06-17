import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Snowflake,
  ShowerHead,
  Ruler,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomStatusBadge } from "@/components/status-badge";
import { RoomGallery } from "@/components/public/room-gallery";
import { BookingForm } from "@/components/public/booking-form";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, whatsappLink } from "@/lib/settings";
import { ROOM_CATEGORY_LABEL } from "@/lib/constants";
import { formatRupiah, parseFacilities } from "@/lib/utils";

type Params = Promise<{ id: string }>;

async function getRoom(id: string) {
  return prisma.room.findUnique({
    where: { id },
    include: { photos: { orderBy: { sort: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room) return { title: "Kamar tidak ditemukan" };
  return {
    title: room.name || `Kamar ${room.number}`,
    description: `${room.name || `Kamar ${room.number}`} — ${formatRupiah(
      room.monthlyPrice
    )}/bulan. ${room.description ?? ""}`.trim(),
  };
}

export default async function RoomDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const [room, settings] = await Promise.all([getRoom(id), getSiteSettings()]);

  if (!room) notFound();

  const facilities = parseFacilities(room.facilities);
  const isAvailable = room.status === "AVAILABLE";

  const specs = [
    room.size && { icon: Ruler, label: room.size },
    { icon: ShowerHead, label: room.privateBath ? "KM dalam" : "KM luar" },
    { icon: Snowflake, label: room.hasAC ? "Ber-AC" : "Non-AC" },
  ].filter(Boolean) as { icon: typeof Ruler; label: string }[];

  return (
    <div className="container py-8">
      <Link
        href="/kamar"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali ke daftar kamar
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: gallery + info */}
        <div>
          <RoomGallery
            photos={room.photos}
            alt={room.name || `Kamar ${room.number}`}
          />

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <RoomStatusBadge status={room.status} />
              <Badge variant="outline">
                {ROOM_CATEGORY_LABEL[room.category]}
              </Badge>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
              {room.name || `Kamar ${room.number}`}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Nomor kamar: {room.number}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {specs.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/50 px-3 py-1 text-sm"
                >
                  <s.icon className="size-4 text-primary" /> {s.label}
                </span>
              ))}
            </div>

            {room.description && (
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {room.description}
              </p>
            )}

            {facilities.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-lg font-semibold">
                  Fasilitas kamar
                </h2>
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {facilities.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right: pricing + booking */}
        <div>
          <div className="sticky top-20 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Harga sewa</p>
                <p className="font-display text-3xl font-bold text-primary">
                  {formatRupiah(room.monthlyPrice)}
                  <span className="text-base font-medium text-muted-foreground">
                    {" "}
                    /bulan
                  </span>
                </p>
              </div>
            </div>
            {room.deposit > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                Deposit: {formatRupiah(room.deposit)}
              </p>
            )}

            <hr className="my-5" />

            {isAvailable ? (
              <>
                <h2 className="font-display text-lg font-semibold">
                  Form Booking
                </h2>
                <p className="mb-4 mt-1 text-sm text-muted-foreground">
                  Isi data berikut. Admin akan menghubungi untuk konfirmasi.
                </p>
                <BookingForm roomId={room.id} />
              </>
            ) : (
              <div className="text-center">
                <p className="font-medium">Kamar ini sedang tidak tersedia</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hubungi kami untuk info waiting list atau kamar lain yang
                  serupa.
                </p>
                <Button
                  asChild
                  className="mt-4 w-full bg-[#25D366] hover:bg-[#1eb858]"
                >
                  <a
                    href={whatsappLink(
                      settings.whatsapp,
                      `Halo ${settings.siteName}, saya tertarik dengan kamar ${room.number}. Apakah ada waiting list?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" /> Tanya via WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
