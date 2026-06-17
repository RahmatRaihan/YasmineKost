import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TenantForm } from "@/components/admin/tenant-form";
import { CheckoutTenantButton } from "@/components/admin/checkout-tenant-button";
import { DeleteTenantButton } from "@/components/admin/delete-tenant-button";
import { PaymentStatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/prisma";
import { formatDate, formatRupiah, monthName } from "@/lib/utils";

export const metadata = { title: "Detail Penghuni" };

type Params = Promise<{ id: string }>;

function toDateInput(d: Date | null): string | null {
  if (!d) return null;
  return d.toISOString().split("T")[0];
}

export default async function TenantDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      room: true,
      payments: { orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }] },
    },
  });

  if (!tenant) notFound();

  return (
    <>
      <Link
        href="/admin/penghuni"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali
      </Link>
      <AdminPageHeader
        title={tenant.name}
        description={`Kamar ${tenant.room.number} · masuk ${formatDate(
          tenant.moveInDate
        )}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {tenant.status === "ACTIVE" ? (
              <CheckoutTenantButton tenantId={tenant.id} />
            ) : (
              <Badge variant="muted">Non-aktif</Badge>
            )}
            <DeleteTenantButton
              tenantId={tenant.id}
              tenantName={tenant.name}
            />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">
                Data penghuni
              </h2>
              <TenantForm
                initial={{
                  id: tenant.id,
                  name: tenant.name,
                  phone: tenant.phone,
                  email: tenant.email,
                  idCardNumber: tenant.idCardNumber,
                  emergencyContact: tenant.emergencyContact,
                  contractEndDate: toDateInput(tenant.contractEndDate),
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">
                  Pembayaran
                </h2>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/pembayaran/baru?tenant=${tenant.id}`}>
                    <Plus className="size-4" /> Tagihan
                  </Link>
                </Button>
              </div>

              {tenant.payments.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Belum ada tagihan.
                </p>
              ) : (
                <ul className="divide-y">
                  {tenant.payments.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {monthName(p.periodMonth)} {p.periodYear}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRupiah(p.amount)} · jatuh tempo{" "}
                          {formatDate(p.dueDate)}
                        </p>
                      </div>
                      <PaymentStatusBadge status={p.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
