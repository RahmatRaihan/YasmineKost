import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentForm } from "@/components/admin/payment-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tagihan Baru" };

type SearchParams = Promise<{ tenant?: string }>;

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { tenant } = await searchParams;
  const tenants = await prisma.tenant.findMany({
    where: { status: "ACTIVE" },
    include: { room: true },
    orderBy: { name: "asc" },
  });

  const now = new Date();

  return (
    <>
      <Link
        href="/admin/pembayaran"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali
      </Link>
      <AdminPageHeader
        title="Buat Tagihan"
        description="Catat tagihan bulanan untuk seorang penghuni."
      />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <PaymentForm
            tenants={tenants.map((t) => ({
              id: t.id,
              name: t.name,
              roomNumber: t.room.number,
              monthlyPrice: t.room.monthlyPrice,
            }))}
            defaultTenantId={tenant}
            currentMonth={now.getMonth() + 1}
            currentYear={now.getFullYear()}
          />
        </CardContent>
      </Card>
    </>
  );
}
