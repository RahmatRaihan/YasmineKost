"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateBookingCode } from "@/lib/utils";

export type BookingFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const schema = z.object({
  roomId: z.string().min(1, "Kamar tidak valid."),
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,20}$/, "Nomor HP tidak valid."),
  email: z
    .string()
    .trim()
    .email("Email tidak valid.")
    .optional()
    .or(z.literal("")),
  moveInDate: z.string().min(1, "Tanggal masuk wajib diisi."),
  durationMonths: z.coerce
    .number()
    .int()
    .min(1, "Lama sewa minimal 1 bulan.")
    .max(36, "Lama sewa maksimal 36 bulan."),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function createBooking(
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const parsed = schema.safeParse({
    roomId: formData.get("roomId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    moveInDate: formData.get("moveInDate"),
    durationMonths: formData.get("durationMonths"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Periksa kembali isian formulir.", fieldErrors };
  }

  const data = parsed.data;

  const moveIn = new Date(data.moveInDate);
  if (Number.isNaN(moveIn.getTime())) {
    return {
      ok: false,
      fieldErrors: { moveInDate: "Tanggal tidak valid." },
    };
  }

  const room = await prisma.room.findUnique({ where: { id: data.roomId } });
  if (!room) {
    return { ok: false, error: "Kamar tidak ditemukan." };
  }
  if (room.status !== "AVAILABLE") {
    return {
      ok: false,
      error: "Maaf, kamar ini sudah tidak tersedia. Silakan pilih kamar lain.",
    };
  }

  const code = generateBookingCode();
  await prisma.booking.create({
    data: {
      code,
      roomId: room.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      moveInDate: moveIn,
      durationMonths: data.durationMonths,
      message: data.message || null,
      status: "PENDING",
    },
  });

  // redirect() melempar exception khusus yang ditangani Next.js — taruh di luar try/catch.
  redirect(`/booking/sukses?code=${code}`);
}
