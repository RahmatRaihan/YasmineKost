// Label & opsi terpusat agar konsisten di seluruh aplikasi.

export const ROOM_CATEGORIES = ["PUTRA", "PUTRI", "CAMPUR"] as const;
export type RoomCategory = (typeof ROOM_CATEGORIES)[number];

export const ROOM_CATEGORY_LABEL: Record<string, string> = {
  PUTRA: "Putra",
  PUTRI: "Putri",
  CAMPUR: "Campur",
};

export const ROOM_STATUSES = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"] as const;
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export const ROOM_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Tersedia",
  OCCUPIED: "Terisi",
  MAINTENANCE: "Perbaikan",
};

export const BOOKING_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "CONVERTED",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
  CONVERTED: "Jadi Penghuni",
};

export const PAYMENT_STATUSES = [
  "UNPAID",
  "PENDING_VERIFICATION",
  "PAID",
  "OVERDUE",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Belum Bayar",
  PENDING_VERIFICATION: "Menunggu Verifikasi",
  PAID: "Lunas",
  OVERDUE: "Terlambat",
};

// Pilihan fasilitas umum untuk form kamar.
export const COMMON_ROOM_FACILITIES = [
  "Kasur",
  "Lemari",
  "Meja Belajar",
  "WiFi",
  "AC",
  "Kamar Mandi Dalam",
  "Kipas Angin",
  "Jendela",
];
