import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

/** Folder root penyimpanan upload (bisa diatur via env UPLOAD_DIR). */
export function getUploadRoot(): string {
  const dir = process.env.UPLOAD_DIR || "./uploads";
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function extFromType(type: string): string {
  switch (type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}

/**
 * Simpan sebuah File hasil upload ke folder `subdir` di dalam UPLOAD_DIR.
 * Mengembalikan path publik yang bisa dipakai di <img src> & next/image,
 * mis. "/api/uploads/rooms/ab12cd34.jpg".
 * Mengembalikan null jika tidak ada file.
 */
export async function saveUploadedImage(
  file: File | null | undefined,
  subdir: "rooms" | "proofs" | "site"
): Promise<string | null> {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return null;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran file maksimal 5 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extFromType(file.type) || path.extname(file.name) || ".bin";
  const filename = `${crypto.randomBytes(12).toString("hex")}${ext}`;

  const targetDir = path.join(getUploadRoot(), subdir);
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, filename), buffer);

  return `/api/uploads/${subdir}/${filename}`;
}
