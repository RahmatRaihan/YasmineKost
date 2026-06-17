"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Splash screen yang muncul saat halaman publik pertama kali dimuat,
 * lalu memudar otomatis. Dismiss digerakkan oleh animasi CSS (`animate-splash`)
 * sehingga tetap hilang meski JS lambat; timer JS hanya melepasnya dari DOM.
 * Karena diletakkan di layout, splash tidak muncul ulang saat navigasi antar
 * halaman (hanya pada full load), dan otomatis dipersingkat bila pengguna
 * memilih "reduce motion".
 */
export function SplashScreen() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2100);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-splash"
    >
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logo.png"
          alt="Yasmine Kost"
          width={180}
          height={258}
          priority
          className="w-36 duration-700 animate-in fade-in zoom-in-95 sm:w-44"
        />
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/4 rounded-full bg-primary animate-progress" />
        </div>
      </div>
    </div>
  );
}
