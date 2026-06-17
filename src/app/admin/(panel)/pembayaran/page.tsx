import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "@/components/status-badge";
import { PaymentActions } from "@/components/admin/payment-actions";
import { GenerateBillsButton } from "@/components/admin/generate-bills-button";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, whatsappLink } from "@/lib/settings";
import { markOverduePayments } from "@/lib/payments";
import { formatDate, formatRupiah, monthName, cn } from "@/lib/utils";
import { PAYMENT_STATUSES } from "@/lib/constants";

export const metadata = { title: "Manajemen Pembayaran" };

type SearchParams = Promise<{ status?: string }>;

const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "UNPAID", label: "Belum Bayar" },
  { value: "PENDING_VERIFICATION", label: "Perlu Verifikasi" },
  { value: "OVERDUE", label: "Terlambat" },
  { value: "PAID", label: "Lunas" },
];

export default async function AdminPembayaranPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await markOverduePayments();

  const { status } = await searchParams;
  const filter = status ?? "all";
  const where =
    filter !== "all" && PAYMENT_STATUSES.includes(filter as never)
      ? { status: filter }
      : {};

  const [payments, settings] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: { tenant: { include: { room: true } } },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    }),
    getSiteSettings(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Manajemen Pembayaran"
        description="Catat tagihan, verifikasi bukti transfer, dan tandai pembayaran lunas."
        action={
          <>
            <GenerateBillsButton />
            <Button asChild>
              <Link href="/admin/pembayaran/baru">
                <Plus className="size-4" /> Tagihan Baru
              </Link>
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/pembayaran?status=${f.value}`}
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
              <TableHead>Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Jatuh tempo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Belum ada tagihan pada filter ini.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => {
                const message = `Halo *${p.tenant.name}*,

Ini adalah pengingat pembayaran sewa *Yasmine Kost* untuk Kamar *${p.tenant.room.number}*.

*Detail Tagihan:*
- Periode: ${monthName(p.periodMonth)} ${p.periodYear}
- Jumlah: ${formatRupiah(p.amount)}
- Jatuh Tempo: ${formatDate(p.dueDate)}

Pembayaran dapat ditransfer ke:
- ${settings.bankName}
- No. Rekening: ${settings.bankAccountNumber}
- A.n. ${settings.bankAccountHolder}

Silakan kirimkan bukti transfer melalui website atau WhatsApp ini setelah melakukan pembayaran. Terima kasih!`;

                const whatsappUrl = p.status !== "PAID" ? whatsappLink(p.tenant.phone, message) : undefined;

                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/penghuni/${p.tenantId}`}
                        className="hover:underline"
                      >
                        {p.tenant.name}
                      </Link>
                    </TableCell>
                    <TableCell>{p.tenant.room.number}</TableCell>
                    <TableCell className="text-sm">
                      {monthName(p.periodMonth)} {p.periodYear}
                    </TableCell>
                    <TableCell>{formatRupiah(p.amount)}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(p.dueDate)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={p.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentActions
                        id={p.id}
                        status={p.status}
                        proofUrl={p.proofUrl}
                        whatsappUrl={whatsappUrl}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
