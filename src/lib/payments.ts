import { prisma } from "@/lib/prisma";

/**
 * Tandai tagihan UNPAID yang sudah lewat jatuh tempo menjadi OVERDUE.
 * Dipanggil saat membuka dashboard / halaman pembayaran agar status akurat.
 */
export async function markOverduePayments() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.payment.updateMany({
    where: { status: "UNPAID", dueDate: { lt: today } },
    data: { status: "OVERDUE" },
  });
}
