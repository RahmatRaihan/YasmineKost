import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Sparkles,
  HandCoins,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/public/room-card";
import { FacilityIcon } from "@/components/public/facility-icon";
import { Reveal } from "@/components/public/reveal";
import { getRoomCards } from "@/lib/rooms";
import { getSiteSettings, whatsappLink } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

// Beranda menampilkan ketersediaan kamar terkini, jadi dirender per-request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featured, facilities, availableCount] = await Promise.all([
    getSiteSettings(),
    getRoomCards({ availableOnly: true, take: 3 }),
    prisma.facility.findMany({ orderBy: { sort: "asc" } }),
    prisma.room.count({ where: { status: "AVAILABLE" } }),
  ]);

  const values = [
    {
      icon: Sparkles,
      title: "Bersih & Nyaman",
      desc: "Kamar dan area bersama dirawat rutin agar selalu rapi dan nyaman ditinggali.",
    },
    {
      icon: ShieldCheck,
      title: "Aman 24 Jam",
      desc: "Keamanan dengan CCTV dan akses terkontrol untuk ketenangan penghuni.",
    },
    {
      icon: HandCoins,
      title: "Harga Transparan",
      desc: "Harga sewa jelas tanpa biaya tersembunyi, ditampilkan langsung di website.",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="size-4" /> {availableCount} kamar tersedia
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Tinggal nyaman di{" "}
              <span className="text-primary">{settings.siteName}</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              {settings.tagline}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="transition-transform active:scale-95">
                <Link href="/kamar">
                  Booking Sekarang <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="transition-transform active:scale-95"
              >
                <a
                  href={whatsappLink(
                    settings.whatsapp,
                    `Halo ${settings.siteName}, saya tertarik menyewa kamar.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat WhatsApp
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Mulai dari{" "}
              <span className="font-semibold text-foreground">
                {formatRupiah(Number(settings.startingPrice))}
              </span>{" "}
              / bulan
            </p>
          </div>

          <div className="relative duration-700 animate-in fade-in slide-in-from-bottom-4 [animation-delay:120ms] [animation-fill-mode:both]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted shadow-lg">
              {settings.heroImage ? (
                <Image
                  src={settings.heroImage}
                  alt={settings.siteName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-sage-100 to-accent/50 p-8 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/70 text-primary shadow">
                    <Sparkles className="size-8" />
                  </span>
                  <p className="font-display text-lg font-semibold text-sage-700">
                    Foto bangunan & kamar
                  </p>
                  <p className="max-w-xs text-sm text-sage-700/80">
                    Unggah dari menu <strong>Pengaturan</strong> di panel admin
                    untuk menggantikan placeholder ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="container py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100} className="h-full">
              <div className="h-full rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FACILITIES */}
      <section className="bg-secondary/40 py-14">
        <div className="container">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Fasilitas Bersama
              </h2>
              <p className="mt-2 text-muted-foreground">
                Semua yang kamu butuhkan untuk tinggal dengan tenang.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/fasilitas">
                Lihat semua <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {facilities.map((f, i) => (
              <Reveal key={f.id} delay={i * 60} className="h-full">
                <div className="flex h-full items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FacilityIcon name={f.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="container py-14">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Kamar Tersedia
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pilihan kamar yang siap kamu tempati.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/kamar">
              Semua kamar <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((room, i) => (
              <Reveal key={room.id} delay={i * 100} className="h-full">
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Saat ini semua kamar penuh. Hubungi kami untuk info waiting list.
          </p>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/kamar">Lihat semua kamar</Link>
          </Button>
        </div>
      </section>

      {/* LOCATION + CTA */}
      <section className="bg-secondary/40 py-14">
        <div className="container grid gap-8 md:grid-cols-2 md:items-center">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Lokasi Strategis
            </h2>
            <p className="mt-3 flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" />
              {settings.address}
            </p>
            <p className="mt-3 text-muted-foreground">{settings.nearbyInfo}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Dekat kampus & perkantoran",
                "Akses transportasi mudah",
                "Banyak tempat makan & minimarket",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6">
              <Link href="/lokasi">Lihat peta lokasi</Link>
            </Button>
          </Reveal>
          <Reveal delay={150} className="overflow-hidden rounded-2xl border shadow-sm">
            <iframe
              title="Peta lokasi"
              src={settings.mapsEmbedUrl}
              className="h-[300px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
