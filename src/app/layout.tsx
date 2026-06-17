import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yasmine Kost — Hunian Nyaman & Tepercaya",
    template: "%s · Yasmine Kost",
  },
  description:
    "Yasmine Kost menyediakan kamar kos nyaman, bersih, dan tepercaya untuk mahasiswa & pekerja muda. Lihat kamar, fasilitas, dan booking online dengan mudah.",
  keywords: ["kost", "kos", "kamar kost", "sewa kamar", "Yasmine Kost"],
  openGraph: {
    title: "Yasmine Kost — Hunian Nyaman & Tepercaya",
    description:
      "Kamar kos nyaman, bersih, dan tepercaya. Lihat kamar, fasilitas, dan booking online.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
