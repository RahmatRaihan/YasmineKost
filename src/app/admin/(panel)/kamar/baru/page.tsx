import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { RoomForm } from "@/components/admin/room-form";
import { createRoom } from "@/app/admin/(panel)/kamar/actions";

export const metadata = { title: "Tambah Kamar" };

export default function NewRoomPage() {
  return (
    <>
      <Link
        href="/admin/kamar"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali
      </Link>
      <AdminPageHeader
        title="Tambah Kamar"
        description="Isi detail kamar dan unggah foto. Foto juga bisa ditambah/diatur lagi setelahnya."
      />
      <Card>
        <CardContent className="p-6">
          <RoomForm
            action={createRoom}
            submitLabel="Tambah Kamar"
            showPhotoUpload
          />
        </CardContent>
      </Card>
    </>
  );
}
