"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type TenantFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const schema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,20}$/, "Nomor HP tidak valid."),
  email: z.string().trim().email("Email tidak valid.").optional().or(z.literal("")),
  idCardNumber: z.string().trim().optional(),
  emergencyContact: z.string().trim().optional(),
  contractEndDate: z.string().optional(),
});

export async function updateTenant(
  _prev: TenantFormState,
  formData: FormData
): Promise<TenantFormState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    idCardNumber: formData.get("idCardNumber"),
    emergencyContact: formData.get("emergencyContact"),
    contractEndDate: formData.get("contractEndDate"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Periksa kembali isian.", fieldErrors };
  }

  const d = parsed.data;
  const contractEnd =
    d.contractEndDate && d.contractEndDate.length > 0
      ? new Date(d.contractEndDate)
      : null;

  await prisma.tenant.update({
    where: { id: d.id },
    data: {
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      idCardNumber: d.idCardNumber || null,
      emergencyContact: d.emergencyContact || null,
      contractEndDate:
        contractEnd && !Number.isNaN(contractEnd.getTime()) ? contractEnd : null,
    },
  });

  revalidatePath("/admin/penghuni");
  revalidatePath(`/admin/penghuni/${d.id}`);
  return { ok: true };
}

/**
 * Hapus penghuni secara permanen beserta riwayat pembayarannya
 * (Payment ikut terhapus via onDelete: Cascade). Kamar yang ditempati
 * dibebaskan kembali (OCCUPIED -> AVAILABLE).
 */
export async function deleteTenant(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) return;

  await prisma.$transaction([
    prisma.room.updateMany({
      where: { id: tenant.roomId, status: "OCCUPIED" },
      data: { status: "AVAILABLE" },
    }),
    prisma.tenant.delete({ where: { id } }),
  ]);

  revalidatePath("/admin/penghuni");
  revalidatePath("/admin/kamar");
  revalidatePath("/admin/pembayaran");
  revalidatePath("/admin");
  revalidatePath("/kamar");
  redirect("/admin/penghuni");
}

/** Penghuni keluar: tandai INACTIVE & bebaskan kamar (AVAILABLE). */
export async function checkoutTenant(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) return;

  await prisma.$transaction([
    prisma.tenant.update({ where: { id }, data: { status: "INACTIVE" } }),
    prisma.room.update({
      where: { id: tenant.roomId },
      data: { status: "AVAILABLE" },
    }),
  ]);

  revalidatePath("/admin/penghuni");
  revalidatePath("/admin/kamar");
  revalidatePath("/kamar");
  redirect("/admin/penghuni");
}

const createSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,20}$/, "Nomor HP tidak valid."),
  email: z.string().trim().email("Email tidak valid.").optional().or(z.literal("")),
  idCardNumber: z.string().trim().optional(),
  emergencyContact: z.string().trim().optional(),
  roomId: z.string().min(1, "Kamar wajib dipilih."),
  moveInDate: z.string().min(1, "Tanggal masuk wajib diisi."),
  contractEndDate: z.string().optional(),
});

export async function createTenant(
  _prev: TenantFormState,
  formData: FormData
): Promise<TenantFormState> {
  await requireAdmin();
  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    idCardNumber: formData.get("idCardNumber"),
    emergencyContact: formData.get("emergencyContact"),
    roomId: formData.get("roomId"),
    moveInDate: formData.get("moveInDate"),
    contractEndDate: formData.get("contractEndDate"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Periksa kembali isian.", fieldErrors };
  }

  const d = parsed.data;

  // Pastikan kamar valid dan masih tersedia
  const room = await prisma.room.findUnique({
    where: { id: d.roomId },
  });
  if (!room) {
    return { ok: false, error: "Kamar tidak ditemukan." };
  }
  if (room.status !== "AVAILABLE") {
    return { ok: false, error: "Kamar ini sudah terisi atau sedang dalam perbaikan." };
  }

  const moveIn = new Date(d.moveInDate);
  const contractEnd =
    d.contractEndDate && d.contractEndDate.length > 0
      ? new Date(d.contractEndDate)
      : null;

  try {
    await prisma.$transaction([
      prisma.tenant.create({
        data: {
          name: d.name,
          phone: d.phone,
          email: d.email || null,
          idCardNumber: d.idCardNumber || null,
          emergencyContact: d.emergencyContact || null,
          roomId: d.roomId,
          moveInDate: moveIn,
          contractEndDate:
            contractEnd && !Number.isNaN(contractEnd.getTime()) ? contractEnd : null,
          status: "ACTIVE",
        },
      }),
      // Otomatis ubah status kamar menjadi OCCUPIED
      prisma.room.update({
        where: { id: d.roomId },
        data: { status: "OCCUPIED" },
      }),
    ]);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menambahkan penghuni." };
  }

  revalidatePath("/admin/penghuni");
  revalidatePath("/admin/kamar");
  revalidatePath("/kamar");
  revalidatePath("/admin");
  
  redirect("/admin/penghuni");
}
