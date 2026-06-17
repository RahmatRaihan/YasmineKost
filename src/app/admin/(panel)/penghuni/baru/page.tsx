import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { NewTenantForm } from "@/components/admin/new-tenant-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tambah Penghuni Baru" };

export default async function NewTenantPage() {
  const rooms = await prisma.room.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { number: "asc" },
  });

  return (
    <>
      <Link
        href="/admin/penghuni"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali
      </Link>
      
      <AdminPageHeader
        title="Tambah Penghuni Baru"
        description="Daftarkan penghuni baru secara langsung ke kamar yang kosong."
      />

      <div className="max-w-3xl">
        <Card>
          <CardContent className="p-6">
            {rooms.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Tidak ada kamar yang tersedia saat ini.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Silakan kosongkan kamar atau tambahkan kamar baru terlebih dahulu.
                </p>
                <Link
                  href="/admin/kamar"
                  className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Kelola Kamar &rarr;
                </Link>
              </div>
            ) : (
              <NewTenantForm rooms={rooms} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
