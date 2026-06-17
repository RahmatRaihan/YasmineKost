"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";

export type PaymentFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function revalidatePayments() {
  revalidatePath("/admin/pembayaran");
  revalidatePath("/admin");
}

const createSchema = z.object({
  tenantId: z.string().min(1, "Penghuni wajib dipilih."),
  periodMonth: z.coerce.number().int().min(1).max(12),
  periodYear: z.coerce.number().int().min(2020).max(2100),
  amount: z.coerce.number().int().min(0, "Jumlah tidak valid."),
  dueDate: z.string().min(1, "Tanggal jatuh tempo wajib diisi."),
  notes: z.string().trim().max(500).optional(),
});

export async function createPayment(
  _prev: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  await requireAdmin();
  const parsed = createSchema.safeParse({
    tenantId: formData.get("tenantId"),
    periodMonth: formData.get("periodMonth"),
    periodYear: formData.get("periodYear"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
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
  const due = new Date(d.dueDate);
  if (Number.isNaN(due.getTime())) {
    return { ok: false, fieldErrors: { dueDate: "Tanggal tidak valid." } };
  }

  const existing = await prisma.payment.findUnique({
    where: {
      tenantId_periodMonth_periodYear: {
        tenantId: d.tenantId,
        periodMonth: d.periodMonth,
        periodYear: d.periodYear,
      },
    },
  });
  if (existing) {
    return {
      ok: false,
      error: "Tagihan untuk penghuni & periode ini sudah ada.",
    };
  }

  await prisma.payment.create({
    data: {
      tenantId: d.tenantId,
      periodMonth: d.periodMonth,
      periodYear: d.periodYear,
      amount: d.amount,
      dueDate: due,
      notes: d.notes || null,
      status: "UNPAID",
    },
  });

  revalidatePayments();
  redirect("/admin/pembayaran");
}

/** Buat tagihan bulan berjalan untuk semua penghuni aktif yang belum ditagih. */
export async function generateMonthlyBills() {
  await requireAdmin();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const tenants = await prisma.tenant.findMany({
    where: { status: "ACTIVE" },
    include: { room: true },
  });

  for (const t of tenants) {
    const exists = await prisma.payment.findUnique({
      where: {
        tenantId_periodMonth_periodYear: {
          tenantId: t.id,
          periodMonth: month,
          periodYear: year,
        },
      },
    });
    if (exists) continue;

    const day = Math.min(t.moveInDate.getDate() || 5, 28);
    const dueDate = new Date(year, month - 1, day);

    await prisma.payment.create({
      data: {
        tenantId: t.id,
        periodMonth: month,
        periodYear: year,
        amount: t.room.monthlyPrice,
        dueDate,
        status: "UNPAID",
      },
    });
  }

  revalidatePayments();
  redirect("/admin/pembayaran");
}

export async function markPaid(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.payment.update({
    where: { id },
    data: { status: "PAID", paidDate: new Date() },
  });
  revalidatePayments();
}

export async function markUnpaid(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.payment.update({
    where: { id },
    data: { status: "UNPAID", paidDate: null },
  });
  revalidatePayments();
}

export async function deletePayment(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.payment.delete({ where: { id } });
  revalidatePayments();
}

export async function uploadPaymentProof(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const file = formData.get("proof");
  const url = await saveUploadedImage(file instanceof File ? file : null, "proofs");
  if (url) {
    await prisma.payment.update({
      where: { id },
      data: { proofUrl: url, status: "PENDING_VERIFICATION" },
    });
  }
  revalidatePayments();
}
