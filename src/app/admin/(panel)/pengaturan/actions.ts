"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";
import { normalizeWhatsappNumber } from "@/lib/settings";

export type SettingsFormState = {
  ok: boolean;
  error?: string;
};

// Kunci teks yang bisa diedit dari halaman Pengaturan.
const TEXT_KEYS = [
  "siteName",
  "tagline",
  "startingPrice",
  "phone",
  "whatsapp",
  "email",
  "address",
  "mapsEmbedUrl",
  "nearbyInfo",
  "bankName",
  "bankAccountNumber",
  "bankAccountHolder",
] as const;

async function setSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

function revalidatePublic() {
  // Pengaturan dipakai di header/footer & banyak halaman -> segarkan semuanya.
  revalidatePath("/", "layout");
  revalidatePath("/admin/pengaturan");
}

export async function updateSettings(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const siteName = String(formData.get("siteName") || "").trim();
  if (!siteName) {
    return { ok: false, error: "Nama situs wajib diisi." };
  }

  const whatsapp = normalizeWhatsappNumber(String(formData.get("whatsapp") || ""));
  if (whatsapp && !/^[0-9]{8,15}$/.test(whatsapp)) {
    return {
      ok: false,
      error: "Nomor WhatsApp tidak valid. Contoh: 08125679294 atau 628125679294.",
    };
  }

  for (const key of TEXT_KEYS) {
    const raw = formData.get(key);
    if (raw === null) continue;
    let value = String(raw).trim();
    if (key === "whatsapp") value = whatsapp;
    if (key === "startingPrice") value = value.replace(/[^0-9]/g, "") || "0";
    await setSetting(key, value);
  }

  revalidatePublic();
  return { ok: true };
}

export async function uploadHeroImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("heroImage");
  try {
    const url = await saveUploadedImage(
      file instanceof File ? file : null,
      "site"
    );
    if (url) await setSetting("heroImage", url);
  } catch {
    // diabaikan; halaman akan tetap menampilkan kondisi terkini
  }
  revalidatePublic();
}

export async function removeHeroImage() {
  await requireAdmin();
  await setSetting("heroImage", "");
  revalidatePublic();
}
