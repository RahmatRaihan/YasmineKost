import Link from "next/link";
import { Plus, Pencil, ImageIcon, AlertCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RoomStatusBadge } from "@/components/status-badge";
import { DeleteRoomButton } from "@/components/admin/delete-room-button";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { ROOM_CATEGORY_LABEL } from "@/lib/constants";

export const metadata = { title: "Manajemen Kamar" };

type SearchParams = Promise<{ error?: string }>;

export default async function AdminKamarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const rooms = await prisma.room.findMany({
    orderBy: { number: "asc" },
    include: {
      _count: { select: { photos: true } },
      tenant: { select: { name: true, status: true } },
    },
  });

  return (
    <>
      <AdminPageHeader
        title="Manajemen Kamar"
        description={`${rooms.length} kamar terdaftar`}
        action={
          <Button asChild>
            <Link href="/admin/kamar/baru">
              <Plus className="size-4" /> Tambah Kamar
            </Link>
          </Button>
        }
      />

      {error === "occupied" && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Kamar tidak dapat dihapus karena masih ditempati penghuni aktif.
          </span>
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kamar</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga / bln</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Penghuni</TableHead>
              <TableHead>Foto</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">
                  {room.number}
                  {room.name && (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {room.name}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {ROOM_CATEGORY_LABEL[room.category]}
                  </Badge>
                </TableCell>
                <TableCell>{formatRupiah(room.monthlyPrice)}</TableCell>
                <TableCell>
                  <RoomStatusBadge status={room.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {room.tenant && room.tenant.status === "ACTIVE"
                    ? room.tenant.name
                    : "-"}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <ImageIcon className="size-3.5" />
                    {room._count.photos}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/kamar/${room.id}`}>
                        <Pencil className="size-4" /> Edit
                      </Link>
                    </Button>
                    <DeleteRoomButton
                      roomId={room.id}
                      roomNumber={room.number}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
