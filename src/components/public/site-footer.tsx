import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Lock } from "lucide-react";
import type { SettingKey } from "@/lib/settings";

export function SiteFooter({
  settings,
}: {
  settings: Record<SettingKey, string>;
}) {
  return (
    <footer className="mt-16 border-t border-border/70 bg-secondary/40">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/logo-mark.png"
              alt={settings.siteName}
              width={40}
              height={40}
              className="size-10"
            />
            <span className="font-display text-lg font-semibold">
              {settings.siteName}
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {settings.tagline}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Tautan</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/kamar" className="hover:text-foreground">
                Daftar Kamar
              </Link>
            </li>
            <li>
              <Link href="/fasilitas" className="hover:text-foreground">
                Fasilitas
              </Link>
            </li>
            <li>
              <Link href="/lokasi" className="hover:text-foreground">
                Lokasi
              </Link>
            </li>
            <li>
              <Link href="/peraturan" className="hover:text-foreground">
                Peraturan Kost
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Kontak</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <span>{settings.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 py-5">
        <div className="container flex flex-col items-center justify-center gap-1 text-center text-xs text-muted-foreground sm:flex-row sm:gap-2">
          <span>
            © {new Date().getFullYear()} {settings.siteName}. Seluruh hak cipta
            dilindungi.
          </span>
          <span className="hidden sm:inline" aria-hidden>
            ·
          </span>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
          >
            <Lock className="size-3" /> Login Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
