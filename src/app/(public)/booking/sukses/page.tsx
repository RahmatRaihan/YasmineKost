import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Copy, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, whatsappLink } from "@/lib/settings";
import { formatDate, formatRupiah } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Booking Terkirim",
  robots: { index: false },
};

type SearchParams = Promise<{ code?: string }>;

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { code } = await searchParams;
  const settings = await getSiteSettings();

  const booking = code
    ? await prisma.booking.findUnique({
        where: { code },
        include: { room: true },
      })
    : null;

  const waMessage = booking
    ? `Halo ${settings.siteName}, saya sudah booking kamar ${booking.room.number} dengan kode ${booking.code} atas nama ${booking.name}.`
    : `Halo ${settings.siteName}, saya baru saja melakukan booking.`;

  return (
    <div className="container max-w-2xl py-14">
      <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-sage-100 text-primary">
          <CheckCircle2 className="size-9" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">
          Booking berhasil dikirim!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Terima kasih{booking ? `, ${booking.name}` : ""}. Permintaan booking
          kamu sudah kami terima dan sedang menunggu konfirmasi admin.
        </p>

        {booking && (
          <div className="mx-auto mt-6 max-w-sm rounded-xl border bg-secondary/40 p-5 text-left text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Kode booking</span>
              <span className="inline-flex items-center gap-1 font-mono font-semibold">
                {booking.code} <Copy className="size-3.5 text-muted-foreground" />
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Kamar</span>
              <span className="font-medium">
                {booking.room.name || `Kamar ${booking.room.number}`}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Tanggal masuk</span>
              <span className="font-medium">
                {formatDate(booking.moveInDate)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Lama sewa</span>
              <span className="font-medium">{booking.durationMonths} bulan</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Sewa per bulan</span>
              <span className="font-medium">
                {formatRupiah(booking.room.monthlyPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Langkah selanjutnya */}
        <div className="mt-8 text-left">
          <h2 className="font-display text-lg font-semibold">
            Langkah selanjutnya
          </h2>
          <ol className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </span>
              Admin akan menghubungi kamu via WhatsApp untuk verifikasi dan
              informasi pembayaran.
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </span>
              Setelah disetujui, lakukan transfer DP/sewa pertama ke rekening
              berikut:
            </li>
          </ol>

          <div className="mt-3 flex items-start gap-3 rounded-xl border bg-card p-4">
            <Building2 className="mt-0.5 size-5 text-primary" />
            <div className="text-sm">
              <p className="font-medium">{settings.bankName}</p>
              <p className="font-mono">{settings.bankAccountNumber}</p>
              <p className="text-muted-foreground">
                a.n. {settings.bankAccountHolder}
              </p>
            </div>
          </div>

          <ol className="mt-3 space-y-3 text-sm text-muted-foreground" start={3}>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </span>
              Kirim bukti transfer ke admin via WhatsApp untuk diverifikasi.
            </li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-[#25D366] hover:bg-[#1eb858]">
            <a
              href={whatsappLink(settings.whatsapp, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" /> Hubungi admin via WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/kamar">Lihat kamar lain</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
