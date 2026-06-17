"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";
import { ROOM_CATEGORIES, ROOM_STATUSES } from "@/lib/constants";

export type RoomFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const roomSchema = z.object({
  number: z.string().trim().min(1, "Nomor kamar wajib diisi."),
  name: z.string().trim().optional(),
  category: z.enum(ROOM_CATEGORIES),
  monthlyPrice: z.coerce.number().int().min(0, "Harga tidak valid."),
  deposit: z.coerce.number().int().min(0).default(0),
  size: z.string().trim().optional(),
  status: z.enum(ROOM_STATUSES),
  description: z.string().trim().max(2000).optional(),
});

function parseForm(formData: FormData) {
  const facilities = formData.getAll("facilities").map(String).filter(Boolean);
  const privateBath =
    formData.get("privateBath") === "on" || facilities.includes("Kamar Mandi Dalam");
  const hasAC = formData.get("hasAC") === "on" || facilities.includes("AC");

  const parsed = roomSchema.safeParse({
    number: formData.get("number"),
    name: formData.get("name"),
    category: formData.get("category"),
    monthlyPrice: formData.get("monthlyPrice"),
    deposit: formData.get("deposit"),
    size: formData.get("size"),
    status: formData.get("status"),
    description: formData.get("description"),
  });

  return { parsed, facilities, privateBath, hasAC };
}

function collectFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function createRoom(
  _prev: RoomFormState,
  formData: FormData
): Promise<RoomFormState> {
  await requireAdmin();
  const { parsed, facilities, privateBath, hasAC } = parseForm(formData);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Periksa kembali isian.",
      fieldErrors: collectFieldErrors(parsed.error),
    };
  }

  const d = parsed.data;
  const existing = await prisma.room.findUnique({
    where: { number: d.number },
  });
  if (existing) {
    return { ok: false, fieldErrors: { number: "Nomor kamar sudah dipakai." } };
  }

  // Simpan foto yang diunggah bersama form (opsional). Disimpan lebih dulu agar
  // jika ada file tidak valid, kamar belum terlanjur dibuat.
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const photoUrls: string[] = [];
  try {
    for (const file of files) {
      const url = await saveUploadedImage(file, "rooms");
      if (url) photoUrls.push(url);
    }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Gagal mengunggah foto.",
    };
  }

  const room = await prisma.room.create({
    data: {
      number: d.number,
      name: d.name || null,
      category: d.category,
      monthlyPrice: d.monthlyPrice,
      deposit: d.deposit,
      size: d.size || null,
      privateBath,
      hasAC,
      description: d.description || null,
      status: d.status,
      facilities: JSON.stringify(facilities),
      photos: photoUrls.length
        ? { create: photoUrls.map((url, i) => ({ url, sort: i })) }
        : undefined,
    },
  });

  revalidatePath("/admin/kamar");
  revalidatePath("/kamar");
  // Arahkan ke halaman edit agar foto langsung terlihat & bisa ditambah lagi.
  redirect(`/admin/kamar/${room.id}`);
}

export async function updateRoom(
  _prev: RoomFormState,
  formData: FormData
): Promise<RoomFormState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, error: "ID kamar tidak valid." };

  const { parsed, facilities, privateBath, hasAC } = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Periksa kembali isian.",
      fieldErrors: collectFieldErrors(parsed.error),
    };
  }

  const d = parsed.data;
  const dup = await prisma.room.findFirst({
    where: { number: d.number, NOT: { id } },
  });
  if (dup) {
    return { ok: false, fieldErrors: { number: "Nomor kamar sudah dipakai." } };
  }

  await prisma.room.update({
    where: { id },
    data: {
      number: d.number,
      name: d.name || null,
      category: d.category,
      monthlyPrice: d.monthlyPrice,
      deposit: d.deposit,
      size: d.size || null,
      privateBath,
      hasAC,
      description: d.description || null,
      status: d.status,
      facilities: JSON.stringify(facilities),
    },
  });

  revalidatePath("/admin/kamar");
  revalidatePath(`/admin/kamar/${id}`);
  revalidatePath("/kamar");
  revalidatePath(`/kamar/${id}`);
  redirect("/admin/kamar");
}

export async function deleteRoom(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const activeTenant = await prisma.tenant.findFirst({
    where: { roomId: id, status: "ACTIVE" },
  });
  if (activeTenant) {
    // Jangan hapus kamar yang masih dihuni.
    redirect("/admin/kamar?error=occupied");
  }

  // Hapus data terkait lebih dulu agar tidak melanggar foreign key:
  // - Booking (pengajuan) untuk kamar ini
  // - Penghuni non-aktif yang tersisa beserta pembayarannya (Payment ikut
  //   terhapus via onDelete: Cascade saat tenant dihapus)
  // Foto kamar otomatis terhapus (onDelete: Cascade pada relasi Photo→Room).
  await prisma.$transaction([
    prisma.booking.deleteMany({ where: { roomId: id } }),
    prisma.tenant.deleteMany({ where: { roomId: id } }),
    prisma.room.delete({ where: { id } }),
  ]);

  revalidatePath("/admin/kamar");
  revalidatePath("/kamar");
  redirect("/admin/kamar");
}

export async function addRoomPhotos(formData: FormData) {
  await requireAdmin();
  const roomId = String(formData.get("roomId") || "");
  if (!roomId) return;

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File);
  const existingCount = await prisma.photo.count({ where: { roomId } });
  let sort = existingCount;

  for (const file of files) {
    const url = await saveUploadedImage(file, "rooms");
    if (url) {
      await prisma.photo.create({ data: { roomId, url, sort } });
      sort++;
    }
  }

  revalidatePath(`/admin/kamar/${roomId}`);
  revalidatePath("/admin/kamar");
  revalidatePath("/kamar");
  revalidatePath(`/kamar/${roomId}`);
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin();
  const photoId = String(formData.get("photoId") || "");
  const roomId = String(formData.get("roomId") || "");
  if (!photoId) return;

  await prisma.photo.delete({ where: { id: photoId } });
  revalidatePath(`/admin/kamar/${roomId}`);
  revalidatePath("/kamar");
}
