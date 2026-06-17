import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Manajemen Penghuni" };

export default async function AdminPenghuniPage() {
  const tenants = await prisma.tenant.findMany({
    include: { room: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const active = tenants.filter((t) => t.status === "ACTIVE");

  return (
    <>
      <AdminPageHeader
        title="Manajemen Penghuni"
        description={`${active.length} penghuni aktif dari ${tenants.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/admin/penghuni/baru">
              <Plus className="mr-1.5 size-4" /> Tambah Penghuni
            </Link>
          </Button>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Masuk</TableHead>
              <TableHead>Kontrak s/d</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Belum ada penghuni. Penghuni muncul setelah booking dikonversi.
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.room.number}</TableCell>
                  <TableCell className="text-sm">{t.phone}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(t.moveInDate)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {t.contractEndDate ? formatDate(t.contractEndDate) : "-"}
                  </TableCell>
                  <TableCell>
                    {t.status === "ACTIVE" ? (
                      <Badge variant="success">Aktif</Badge>
                    ) : (
                      <Badge variant="muted">Non-aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/penghuni/${t.id}`}>
                        <Eye className="size-4" /> Detail
                      </Link>
                    </Button>
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
