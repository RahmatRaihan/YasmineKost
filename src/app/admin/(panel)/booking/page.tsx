import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatusBadge } from "@/components/status-badge";
import { BookingActions } from "@/components/admin/booking-actions";
import { prisma } from "@/lib/prisma";
import { formatDate, cn } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";

export const metadata = { title: "Manajemen Booking" };

type SearchParams = Promise<{ status?: string; error?: string }>;

const FILTERS = [
  { value: "PENDING", label: "Menunggu" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "all", label: "Semua" },
];

export default async function AdminBookingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, error } = await searchParams;
  const filter = status ?? "PENDING";
  const where =
    filter !== "all" && BOOKING_STATUSES.includes(filter as never)
      ? { status: filter }
      : {};

  const bookings = await prisma.booking.findMany({
    where,
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminPageHeader
        title="Manajemen Booking"
        description="Tinjau, setujui, atau tolak pengajuan booking calon penyewa."
      />

      {error === "room-occupied" && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>Kamar sudah memiliki penghuni aktif, booking tidak bisa dikonversi.</span>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/booking?status=${f.value}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode / Pemohon</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Masuk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Tidak ada booking pada filter ini.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                      {b.code}
                    </span>
                    <span className="block font-medium">{b.name}</span>
                    {b.message && (
                      <span className="block max-w-xs truncate text-xs text-muted-foreground">
                        “{b.message}”
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{b.room.number}</TableCell>
                  <TableCell className="text-sm">
                    <span className="block">{b.phone}</span>
                    {b.email && (
                      <span className="block text-xs text-muted-foreground">
                        {b.email}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(b.moveInDate)}
                    <span className="block text-xs text-muted-foreground">
                      {b.durationMonths} bulan
                    </span>
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={b.status} />
                  </TableCell>
                  <TableCell>
                    <BookingActions id={b.id} status={b.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
