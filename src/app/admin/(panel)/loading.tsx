// Skeleton yang tampil seketika saat berpindah antar halaman admin,
// sementara server merender konten. Sidebar & topbar tetap (dari layout),
// hanya area konten ini yang berganti jadi kerangka.
export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Judul halaman */}
      <div className="mb-6 space-y-2">
        <div className="h-7 w-52 rounded-md bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted/60" />
      </div>

      {/* Kartu statistik */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="size-11 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded bg-muted/60" />
                <div className="h-5 w-16 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel / daftar */}
      <div className="mt-8 rounded-xl border bg-card p-5">
        <div className="mb-5 h-5 w-44 rounded bg-muted" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="h-4 w-1/3 rounded bg-muted/60" />
              <div className="h-4 w-20 rounded bg-muted/60" />
              <div className="h-4 w-16 rounded bg-muted/60" />
              <div className="h-8 w-24 rounded-md bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
