import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/public/reveal";

export const metadata: Metadata = {
  title: "Peraturan Kost",
  description: "Peraturan dan tata tertib penghuni Yasmine Kost.",
};

const RULES: { title: string; items: string[] }[] = [
  {
    title: "Ketertiban & Keamanan",
    items: [
      "Jam malam: gerbang ditutup pukul 23.00. Hubungi pengelola jika pulang lebih malam.",
      "Wajib mengunci kamar dan menjaga barang pribadi masing-masing.",
      "Tamu lawan jenis tidak diperbolehkan masuk ke dalam kamar.",
      "Tamu menginap harus seizin pengelola.",
    ],
  },
  {
    title: "Kebersihan & Kenyamanan",
    items: [
      "Menjaga kebersihan kamar dan area bersama (dapur, kamar mandi, ruang jemur).",
      "Membuang sampah pada tempatnya.",
      "Tidak membuat kegaduhan yang mengganggu penghuni lain.",
    ],
  },
  {
    title: "Pembayaran & Administrasi",
    items: [
      "Pembayaran sewa dilakukan paling lambat tanggal jatuh tempo setiap bulan.",
      "Konfirmasi pembayaran dengan mengirim bukti transfer kepada pengelola.",
      "Pemberitahuan pindah/keluar minimal 1 bulan sebelumnya.",
    ],
  },
  {
    title: "Larangan",
    items: [
      "Dilarang membawa, menyimpan, atau menggunakan narkoba dan minuman keras.",
      "Dilarang berjudi dan melakukan tindakan melanggar hukum.",
      "Dilarang memelihara hewan tanpa izin pengelola.",
    ],
  },
];

export default function PeraturanPage() {
  return (
    <>
      <PageHeader
        title="Peraturan Kost"
        description="Aturan dibuat agar semua penghuni nyaman, aman, dan saling menghormati."
      />
      <div className="container py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {RULES.map((group, i) => (
            <Reveal key={group.title} delay={i * 90} className="h-full">
              <div className="h-full rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <h2 className="font-display text-lg font-semibold">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 rounded-xl border border-dashed bg-muted/30 p-5 text-sm text-muted-foreground">
          Dengan melakukan booking, calon penyewa dianggap telah membaca dan
          menyetujui peraturan di atas.
        </p>
      </div>
    </>
  );
}
