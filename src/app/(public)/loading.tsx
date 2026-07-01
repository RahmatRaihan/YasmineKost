import { Flower2 } from "lucide-react";

// Umpan balik ringan saat berpindah antar halaman publik (yang kini dinamis).
export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Flower2 className="size-5 animate-pulse" />
        </span>
        <span className="text-sm">Memuat…</span>
      </div>
    </div>
  );
}
