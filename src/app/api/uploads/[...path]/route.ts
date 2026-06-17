import { NextRequest } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { getUploadRoot } from "@/lib/uploads";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// Streaming file upload (foto kamar & bukti transfer) dari folder UPLOAD_DIR.
// File sengaja TIDAK ditaruh di /public agar bukti transfer bisa dibatasi
// & ikut volume backup di VPS.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Cegah path traversal: tolak segmen yang mengandung ".." atau pemisah path.
  if (
    !segments ||
    segments.length === 0 ||
    segments.some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))
  ) {
    return new Response("Not found", { status: 404 });
  }

  const root = getUploadRoot();
  const filePath = path.join(root, ...segments);

  // Pastikan tetap berada di dalam root.
  if (!filePath.startsWith(path.resolve(root))) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    const nodeStream = createReadStream(filePath);
    const stream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": info.size.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
