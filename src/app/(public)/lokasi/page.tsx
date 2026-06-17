import type { Metadata } from "next";
import { MapPin, Navigation, GraduationCap, ShoppingCart, Bus } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Lokasi",
  description: "Lokasi Yasmine Kost beserta info area sekitar.",
};

export default async function LokasiPage() {
  const settings = await getSiteSettings();
  const mapsQuery = encodeURIComponent(settings.address);

  const nearby = [
    { icon: GraduationCap, label: "Dekat kampus & sekolah" },
    { icon: ShoppingCart, label: "Minimarket & tempat makan" },
    { icon: Bus, label: "Akses transportasi umum" },
  ];

  return (
    <>
      <PageHeader
        title="Lokasi"
        description="Berada di lokasi yang strategis dan mudah dijangkau."
      />
      <div className="container grid gap-8 py-12 md:grid-cols-2 md:items-start">
        <div>
          <div className="flex items-start gap-3 rounded-xl border bg-card p-5 shadow-sm">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Alamat</p>
              <p className="mt-1 text-muted-foreground">{settings.address}</p>
            </div>
          </div>

          <h2 className="mt-8 font-display text-xl font-semibold">
            Yang ada di sekitar
          </h2>
          <p className="mt-2 text-muted-foreground">{settings.nearbyInfo}</p>
          <ul className="mt-4 space-y-3">
            {nearby.map((n) => (
              <li key={n.label} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <n.icon className="size-5" />
                </span>
                <span className="text-sm">{n.label}</span>
              </li>
            ))}
          </ul>

          <Button asChild className="mt-6">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="size-4" /> Buka di Google Maps
            </a>
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <iframe
            title="Peta lokasi Yasmine Kost"
            src={settings.mapsEmbedUrl}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}
