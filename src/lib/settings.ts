import { prisma } from "@/lib/prisma";

// Kunci & nilai default pengaturan situs. Admin dapat mengubahnya nanti
// (Pengaturan Konten direncanakan di Phase 2); untuk MVP nilai ini di-seed
// dan dipakai di seluruh halaman publik.
export const DEFAULT_SETTINGS = {
  siteName: "Yasmine Kost",
  tagline: "Hunian nyaman, bersih, dan tepercaya untuk mahasiswa & pekerja muda",
  whatsapp: "628125679294", // format internasional tanpa "+"
  phone: "0812-5679-294",
  email: "aztgamingvlog01@gmail.com",
  address: "Jl. Prof M Yamin Gg. Sekadim No 19, Pontianak",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Jl.%20Prof%20M%20Yamin%20Gg.%20Sekadim%20No%2019%2C%20Pontianak&output=embed",
  bankName: "Bank BCA",
  bankAccountNumber: "1234567890",
  bankAccountHolder: "Yasmine Kost",
  nearbyInfo:
    "Dekat kampus, minimarket, warung makan, dan akses transportasi umum.",
  minRentMonths: "1",
  startingPrice: "600000", // harga "mulai dari" yang ditampilkan di hero
  heroImage: "", // foto hero beranda (diunggah dari Pengaturan); kosong = placeholder
} as const;

export type SettingKey = keyof typeof DEFAULT_SETTINGS;

/** Ambil semua pengaturan situs (dengan fallback ke nilai default). */
export async function getSiteSettings(): Promise<
  Record<SettingKey, string>
> {
  const rows = await prisma.siteSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const result = { ...DEFAULT_SETTINGS } as Record<SettingKey, string>;
  for (const key of Object.keys(DEFAULT_SETTINGS) as SettingKey[]) {
    const val = map.get(key);
    if (val !== undefined && val !== "") result[key] = val;
  }
  return result;
}

/** Bangun URL chat WhatsApp dengan pesan opsional. */
export function whatsappLink(number: string, message?: string): string {
  const clean = number.replace(/[^0-9]/g, "");
  const base = `https://wa.me/${clean}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
