import Link from "next/link";
import {
  BedDouble,
  DoorOpen,
  Percent,
  Wallet,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/prisma";
import { markOverduePayments } from "@/lib/payments";
import { formatDate, formatRupiah } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold leading-tight">
            {value}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  await markOverduePayments();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [
    totalRooms,
    occupied,
    available,
    maintenance,
    pendingBookings,
    recentBookings,
    unpaidCount,
    overdueCount,
    activeTenants,
  ] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: "OCCUPIED" } }),
    prisma.room.count({ where: { status: "AVAILABLE" } }),
    prisma.room.count({ where: { status: "MAINTENANCE" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.findMany({
      where: { status: "PENDING" },
      include: { room: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.payment.count({ where: { status: { in: ["UNPAID", "OVERDUE"] } } }),
    prisma.payment.count({ where: { status: "OVERDUE" } }),
    prisma.tenant.findMany({
      where: { status: "ACTIVE" },
      include: { room: true },
    }),
  ]);

  const occupancyRate =
    totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;
  const estimatedIncome = activeTenants.reduce(
    (sum, t) => sum + (t.room?.monthlyPrice ?? 0),
    0
  );

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description={`Ringkasan kost — ${formatDate(now)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BedDouble}
          label="Total kamar"
          value={totalRooms}
          hint={`${maintenance} dalam perbaikan`}
        />
        <StatCard
          icon={DoorOpen}
          label="Terisi / Kosong"
          value={`${occupied} / ${available}`}
        />
        <StatCard
          icon={Percent}
          label="Tingkat hunian"
          value={`${occupancyRate}%`}
        />
        <StatCard
          icon={Wallet}
          label="Estimasi pendapatan/bln"
          value={formatRupiah(estimatedIncome)}
          hint={`${activeTenants.length} penghuni aktif`}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Booking menunggu"
          value={pendingBookings}
        />
        <StatCard
          icon={Wallet}
          label="Tagihan belum lunas"
          value={unpaidCount}
        />
        <StatCard
          icon={AlertTriangle}
          label="Tagihan terlambat"
          value={overdueCount}
        />
        <StatCard
          icon={Percent}
          label="Periode"
          value={`${month}/${year}`}
        />
      </div>

      {/* Booking terbaru */}
      <Card className="mt-8">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Booking menunggu konfirmasi
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/booking">
                Lihat semua <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {recentBookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Tidak ada booking yang menunggu. 🎉
            </p>
          ) : (
            <ul className="divide-y">
              {recentBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {b.name}{" "}
                      <span className="font-mono text-xs text-muted-foreground">
                        ({b.code})
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Kamar {b.room.number} · masuk {formatDate(b.moveInDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={b.status} />
                    <Button asChild size="sm" variant="outline">
                      <Link href="/admin/booking">Proses</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
