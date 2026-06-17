"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  ClipboardList,
  Users,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/kamar", label: "Kamar", icon: BedDouble },
  { href: "/admin/booking", label: "Booking", icon: ClipboardList },
  { href: "/admin/penghuni", label: "Penghuni", icon: Users },
  { href: "/admin/pembayaran", label: "Pembayaran", icon: Wallet },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <Image
            src="/logo-mark.png"
            alt="Yasmine Kost"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="font-display font-semibold">Yasmine Kost</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="border-t p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="size-4" /> Lihat website
          </Link>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-card shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-5">
              <span className="flex items-center gap-2">
                <Image
                  src="/logo-mark.png"
                  alt="Yasmine Kost"
                  width={32}
                  height={32}
                  className="size-8"
                />
                <span className="font-display font-semibold">Yasmine Kost</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Tutup menu">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavLinks />
            </div>
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="size-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              Halo, <span className="font-medium text-foreground">{userName}</span>
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" /> Keluar
            </button>
          </form>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
