import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Upload, Trash2, ImageIcon } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoomForm } from "@/components/admin/room-form";
import {
  updateRoom,
  addRoomPhotos,
  deletePhoto,
} from "@/app/admin/(panel)/kamar/actions";
import { prisma } from "@/lib/prisma";
import { parseFacilities } from "@/lib/utils";

export const metadata = { title: "Edit Kamar" };

type Params = Promise<{ id: string }>;

export default async function EditRoomPage({ params }: { params: Params }) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
    include: { photos: { orderBy: { sort: "asc" } } },
  });

  if (!room) notFound();

  return (
    <>
      <Link
        href="/admin/kamar"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali
      </Link>
      <AdminPageHeader
        title={`Edit Kamar ${room.number}`}
        description="Perbarui detail kamar dan kelola foto."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <RoomForm
                action={updateRoom}
                submitLabel="Simpan Perubahan"
                initial={{
                  id: room.id,
                  number: room.number,
                  name: room.name,
                  category: room.category,
                  monthlyPrice: room.monthlyPrice,
                  deposit: room.deposit,
                  size: room.size,
                  status: room.status,
                  description: room.description,
                  facilities: parseFacilities(room.facilities),
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Photos */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Foto kamar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                JPG/PNG/WEBP, maksimal 5 MB per file.
              </p>

              <form action={addRoomPhotos} className="mt-4 space-y-3">
                <input type="hidden" name="roomId" value={room.id} />
                <div className="space-y-1.5">
                  <Label htmlFor="photos">Unggah foto</Label>
                  <Input
                    id="photos"
                    name="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                  <Upload className="size-4" /> Unggah
                </Button>
              </form>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {room.photos.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center gap-2 rounded-lg border border-dashed py-8 text-muted-foreground">
                    <ImageIcon className="size-7" />
                    <span className="text-sm">Belum ada foto</span>
                  </div>
                ) : (
                  room.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <Image
                        src={photo.url}
                        alt="Foto kamar"
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                      <form
                        action={deletePhoto}
                        className="absolute right-1.5 top-1.5"
                      >
                        <input type="hidden" name="photoId" value={photo.id} />
                        <input type="hidden" name="roomId" value={room.id} />
                        <button
                          type="submit"
                          aria-label="Hapus foto"
                          className="flex size-7 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
