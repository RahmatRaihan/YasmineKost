import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format angka Rupiah, mis. 1500000 -> "Rp 1.500.000". */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

/** Format tanggal panjang Indonesia, mis. "17 Juni 2026". */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** Nama bulan Indonesia dari angka 1-12. */
export function monthName(month: number): string {
  return MONTHS_ID[(month - 1 + 12) % 12] ?? "-";
}

/** Buat kode booking yang mudah dibaca, mis. "YK-7F3A9C". */
export function generateBookingCode(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `YK-${rand}`;
}

/** Parse field facilities (JSON string) menjadi array string yang aman. */
export function parseFacilities(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
