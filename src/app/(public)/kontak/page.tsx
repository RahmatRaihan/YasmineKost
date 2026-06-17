import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Button } from "@/components/ui/button";
import { getSiteSettings, whatsappLink } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Yasmine Kost untuk pertanyaan dan booking.",
};

export default async function KontakPage() {
  const settings = await getSiteSettings();

  const contacts = [
    {
      icon: Phone,
      label: "Telepon",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: settings.address,
    },
  ];

  return (
    <>
      <PageHeader
        title="Kontak"
        description="Punya pertanyaan? Hubungi kami melalui WhatsApp, telepon, atau email."
      />
      <div className="container grid gap-8 py-12 md:grid-cols-2 md:items-start">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">
            Cara tercepat: WhatsApp
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tanya ketersediaan kamar, harga, atau jadwal survei langsung lewat
            WhatsApp. Kami akan membalas secepatnya.
          </p>
          <Button asChild size="lg" className="mt-5 bg-[#25D366] hover:bg-[#1eb858]">
            <a
              href={whatsappLink(
                settings.whatsapp,
                `Halo ${settings.siteName}, saya ingin bertanya.`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-5" /> Chat via WhatsApp
            </a>
          </Button>
        </div>

        <div className="space-y-4">
          {contacts.map((c) => {
            const inner = (
              <div className="flex items-start gap-3 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/40">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {c.value}
                  </p>
                </div>
              </div>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className="block">
                {inner}
              </a>
            ) : (
              <div key={c.label}>{inner}</div>
            );
          })}
        </div>
      </div>
    </>
  );
}
