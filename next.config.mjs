/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // ESLint belum dikonfigurasi pada MVP ini; jangan blokir build produksi.
  // (Pemeriksaan tipe TypeScript tetap aktif.)
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Foto kamar & bukti transfer dikirim lewat Server Action. Batas default
    // Next hanya 1 MB — dinaikkan agar bisa mengunggah beberapa foto sekaligus.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    // Allow next/image to serve files streamed by our /api/uploads route
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
