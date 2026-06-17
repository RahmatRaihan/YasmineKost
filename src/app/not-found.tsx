import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-4 text-center">
      <Image
        src="/logo-mark.png"
        alt="Yasmine Kost"
        width={72}
        height={72}
        className="size-16"
      />
      <h1 className="mt-5 font-display text-3xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">
        Halaman yang kamu cari tidak ditemukan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
