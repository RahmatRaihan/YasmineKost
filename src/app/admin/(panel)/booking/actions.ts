"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function revalidateBooking() {
  revalidatePath("/admin/booking");
  revalidatePath("/admin");
}

export async function approveBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.booking.update({
    where: { id },
    data: { status: "APPROVED" },
  });
  revalidateBooking();
}

export async function rejectBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.booking.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidateBooking();
}

export async function cancelBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  revalidateBooking();
}

/**
 * Konversi booking menjadi penghuni: buat Tenant, set kamar OCCUPIED,
 * tandai booking CONVERTED. Membatalkan booking PENDING lain di kamar yang sama.
 */
export async function convertBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });
  if (!booking) return;

  // Pastikan kamar belum punya penghuni aktif.
  const existingTenant = await prisma.tenant.findUnique({
    where: { roomId: booking.roomId },
  });
  if (existingTenant) {
    redirect("/admin/booking?error=room-occupied");
  }

  // Tanggal berakhir kontrak = tanggal masuk + lama sewa (bulan).
  const contractEndDate = new Date(booking.moveInDate);
  contractEndDate.setMonth(contractEndDate.getMonth() + booking.durationMonths);

  await prisma.$transaction([
    prisma.tenant.create({
      data: {
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        roomId: booking.roomId,
        moveInDate: booking.moveInDate,
        contractEndDate,
        status: "ACTIVE",
      },
    }),
    prisma.room.update({
      where: { id: booking.roomId },
      data: { status: "OCCUPIED" },
    }),
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CONVERTED" },
    }),
    // Batalkan booking pending lain pada kamar yang sama.
    prisma.booking.updateMany({
      where: {
        roomId: booking.roomId,
        status: "PENDING",
        NOT: { id: booking.id },
      },
      data: { status: "CANCELLED" },
    }),
  ]);

  revalidateBooking();
  revalidatePath("/admin/penghuni");
  revalidatePath("/admin/kamar");
  revalidatePath("/kamar");
  redirect("/admin/penghuni");
}

export async function deleteBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.booking.delete({
    where: { id },
  });

  revalidateBooking();
}
