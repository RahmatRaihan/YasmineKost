# PRD — Website Yasmine Kost

| | |
|---|---|
| **Versi** | 1.0 |
| **Tanggal** | 17 Juni 2026 |
| **Disusun untuk** | Pemilik Yasmine Kost |
| **Status** | Draft |

---

## 1. Ringkasan Eksekutif

Yasmine Kost membutuhkan sebuah website yang berfungsi ganda:

1. **Etalase digital (publik)** — untuk menarik calon penyewa, menampilkan kamar, fasilitas, lokasi, dan peraturan secara transparan.
2. **Sistem manajemen internal (admin)** — untuk mengelola kamar, booking, data penghuni, dan pembayaran.

Saat ini kostan memiliki **12 kamar**. Website akan dibangun dengan **Next.js** dan di-deploy secara mandiri ke **VPS** milik pemilik.

Pembayaran dilakukan secara **manual** (transfer bank) dengan konfirmasi **bukti transfer** — **tanpa payment gateway** pada tahap awal. Calon penyewa dapat melakukan **booking online**, lalu admin memverifikasi dan mengonfirmasi secara manual.

---

## 2. Latar Belakang & Tujuan

### Latar Belakang
Pengelolaan kost saat ini kemungkinan dilakukan secara manual (catatan buku/spreadsheet, promosi mulut ke mulut atau platform iklan pihak ketiga). Hal ini menyulitkan pemantauan hunian dan pembayaran, serta membatasi jangkauan promosi.

### Tujuan
- **Meningkatkan hunian** dengan etalase digital yang menarik dan informatif.
- **Mengurangi pertanyaan berulang** dari calon penyewa (harga, fasilitas, ketersediaan) lewat informasi yang lengkap di website.
- **Merapikan administrasi** kamar, penghuni, dan pembayaran dalam satu sistem.
- **Meningkatkan kredibilitas & profesionalisme** Yasmine Kost.

### Metrik Keberhasilan (contoh)
- Jumlah booking masuk per bulan via website.
- Tingkat hunian (occupancy rate) meningkat dari baseline.
- Waktu yang dihemat untuk pencatatan pembayaran manual.

---

## 3. Target Pengguna (User Personas)

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Calon Penyewa** | Mahasiswa / pekerja muda yang mencari kost, mayoritas browsing via HP | Lihat kamar & harga, cek ketersediaan, fasilitas, lokasi, lalu booking dengan mudah |
| **Admin / Pemilik** | Pemilik atau pengelola kost | Kelola kamar, setujui booking, catat & verifikasi pembayaran, pantau hunian |
| **Penghuni Aktif** *(Phase 2)* | Penyewa yang sudah tinggal | Cek tagihan & riwayat pembayaran sendiri, unggah bukti transfer |

---

## 4. Ruang Lingkup (Scope)

### Termasuk (In Scope)
- Halaman publik (etalase) responsif & mobile-first.
- Form booking online untuk calon penyewa.
- Panel admin untuk manajemen kamar, booking, penghuni, dan pembayaran.
- Pembayaran manual (transfer + upload bukti) dengan verifikasi admin.
- Deployment mandiri ke VPS.

### Tidak Termasuk (Out of Scope — untuk versi awal)
- Payment gateway / pembayaran online otomatis (dipertimbangkan di Phase 3).
- Aplikasi mobile native (cukup website responsif).
- Multi-properti (struktur data tetap disiapkan agar mudah dikembangkan nanti).

---

## 5. Fitur & Fungsionalitas

Fitur ditandai dengan prioritas:
**[MVP]** = wajib ada di rilis pertama · **[P2]** = pengembangan lanjutan · **[P3]** = opsional jangka panjang.

### 5.1 Sisi Publik (Etalase)

| Fitur | Prioritas | Keterangan |
|---|---|---|
| **Beranda (Landing Page)** | MVP | Hero dengan foto bangunan, nilai jual utama, ringkasan fasilitas, CTA "Booking Sekarang" & "Chat WhatsApp" |
| **Daftar Kamar** | MVP | Daftar kamar dengan foto, harga/bulan, kategori (putra/putri/campur), dan **status ketersediaan** (tersedia/penuh) |
| **Detail Kamar** | MVP | Galeri foto, harga & deposit, ukuran, fasilitas (kamar mandi dalam/luar, AC/non-AC, dll.), tombol booking |
| **Fasilitas Bersama** | MVP | WiFi, dapur, parkir, ruang jemur, keamanan, dll. dengan ikon |
| **Lokasi** | MVP | Peta Google Maps + info sekitar (kampus, transportasi, tempat makan) |
| **Peraturan Kost** | MVP | Aturan jelas (jam malam, tamu, kebersihan) untuk menyaring penyewa yang cocok |
| **Kontak** | MVP | Tombol WhatsApp langsung, nomor telepon, alamat |
| **Galeri Foto** | P2 | Album lengkap bangunan, kamar, dan area bersama |
| **Testimoni / Ulasan** | P2 | Membangun kepercayaan calon penyewa |
| **FAQ** | P2 | Pertanyaan umum (cara booking, deposit, durasi minimal sewa) |
| **Blog / Artikel** | P3 | Konten ringan untuk SEO (tips ngekost, info area) |

### 5.2 Alur Booking (Calon Penyewa)

| Fitur | Prioritas | Keterangan |
|---|---|---|
| **Form Booking** | MVP | Pilih kamar, tanggal masuk, isi data diri (nama, no. HP, email), catatan |
| **Konfirmasi Booking** | MVP | Halaman/pesan konfirmasi + instruksi langkah selanjutnya (admin akan menghubungi) |
| **Notifikasi ke Admin** | MVP | Admin menerima notifikasi booking baru (di dashboard; opsional email/WA) |
| **Upload Bukti Transfer** | MVP | Setelah booking disetujui, penyewa mengirim bukti transfer DP/sewa pertama |

### 5.3 Sisi Admin (Manajemen)

| Fitur | Prioritas | Keterangan |
|---|---|---|
| **Login Admin** | MVP | Autentikasi aman, hanya admin yang bisa masuk |
| **Dashboard** | MVP | Ringkasan: jumlah kamar terisi/kosong, occupancy rate, booking pending, pembayaran jatuh tempo/terlambat, estimasi pendapatan bulan ini |
| **Manajemen Kamar** | MVP | Tambah/edit/hapus kamar, atur harga & fasilitas, **upload foto**, ubah status (tersedia/terisi/perbaikan) |
| **Manajemen Booking** | MVP | Lihat booking masuk, **setujui / tolak**, konversi menjadi penghuni |
| **Manajemen Penghuni** | MVP | Daftar penghuni aktif, kamar yang ditempati, kontak, tanggal masuk & kontrak |
| **Manajemen Pembayaran** | MVP | Catat pembayaran per bulan, **lihat & verifikasi bukti transfer**, tandai lunas/belum, riwayat pembayaran |
| **Reminder Pembayaran** | P2 | Pengingat otomatis menjelang jatuh tempo (via WA/email) |
| **Generate Invoice / Kuitansi** | P2 | Buat tagihan/kuitansi bulanan (PDF) |
| **Laporan Keuangan** | P2 | Rekap pendapatan & hunian, ekspor ke Excel/PDF |
| **Pengaturan Konten** | P2 | Kelola teks "Tentang", peraturan, kontak, galeri tanpa ngoding |

### 5.4 Portal Penghuni *(Phase 2)*

| Fitur | Prioritas | Keterangan |
|---|---|---|
| **Login Penghuni** | P2 | Akses terbatas untuk penyewa aktif |
| **Cek Tagihan** | P2 | Lihat status tagihan bulan berjalan & jatuh tempo |
| **Riwayat Pembayaran** | P2 | Daftar pembayaran yang sudah dilakukan |
| **Upload Bukti Mandiri** | P2 | Unggah bukti transfer langsung dari portal |

---

## 6. Alur Pengguna (Key User Flows)

### 6.1 Alur Booking
```
Calon penyewa buka website
  → Lihat daftar kamar → Pilih kamar tersedia
  → Isi form booking (data diri + tanggal masuk)
  → Booking tersimpan (status: PENDING) + admin dapat notifikasi
  → Admin meninjau → Setujui / Tolak
  → (Disetujui) Admin kirim info rekening via WhatsApp
  → Penyewa transfer + upload/kirim bukti
  → Admin verifikasi → Booking dikonversi jadi Penghuni, kamar → TERISI
```

### 6.2 Alur Pembayaran Bulanan
```
Admin generate/catat tagihan bulanan per penghuni (status: BELUM BAYAR)
  → Mendekati jatuh tempo: reminder (P2)
  → Penghuni transfer → kirim bukti
  → Admin verifikasi bukti → tandai LUNAS
  → Tercatat di riwayat & laporan
```

---

## 7. Struktur Halaman & Navigasi (Sitemap)

```
PUBLIK
├── / .................... Beranda
├── /kamar ............... Daftar kamar
├── /kamar/[id] .......... Detail kamar + form booking
├── /fasilitas ........... Fasilitas bersama
├── /lokasi .............. Lokasi & peta
├── /peraturan ........... Peraturan kost
├── /galeri .............. Galeri (P2)
├── /faq ................. FAQ (P2)
└── /kontak .............. Kontak

ADMIN (terproteksi login)
├── /admin/login ......... Login
├── /admin ............... Dashboard
├── /admin/kamar ......... Manajemen kamar
├── /admin/booking ....... Manajemen booking
├── /admin/penghuni ...... Manajemen penghuni
├── /admin/pembayaran .... Manajemen pembayaran
└── /admin/pengaturan .... Pengaturan konten (P2)

PENGHUNI (P2, terproteksi login)
└── /portal .............. Tagihan & riwayat pembayaran
```

**Menu navigasi publik (header):** Beranda · Kamar · Fasilitas · Lokasi · Peraturan · Kontak · *(tombol)* **Booking Sekarang**

---

## 8. Desain & Tampilan (UI/UX)

Bagian ini menjawab kebingungan soal "tampilan seperti apa".

### Prinsip Desain
- **Mobile-first.** Mayoritas calon penyewa mencari kost lewat HP — pastikan tampilan rapi di layar kecil dulu, baru desktop.
- **Foto adalah penjual utama.** Sediakan ruang besar untuk foto kamar berkualitas. Investasi pada foto yang terang dan jelas akan sangat memengaruhi konversi.
- **Tepercaya & hangat.** Kost adalah tempat tinggal — desain harus terasa bersih, aman, dan ramah, bukan kaku.
- **CTA jelas.** Tombol "Booking Sekarang" dan "Chat WhatsApp" harus selalu mudah ditemukan.
- **Sederhana.** Hindari tampilan ramai; beri ruang kosong (whitespace) yang cukup.

### Arah Visual
- **Palet warna:** terinspirasi dari bunga melati (*yasmine*) — dominan **putih bersih** dan **netral hangat** (krem/abu lembut), dengan aksen **hijau sage** atau **emas lembut**. Memberi kesan elegan, segar, dan tepercaya.
- **Tipografi:** font sans-serif modern dan mudah dibaca seperti **Poppins** atau **Inter** untuk teks; boleh satu font display untuk judul agar berkarakter.
- **Ikon:** gunakan satu set ikon konsisten (mis. Lucide) untuk fasilitas.
- **Status ketersediaan:** beri penanda visual jelas (badge "Tersedia" hijau / "Penuh" abu) pada kartu kamar.

### Komponen & Styling (rekomendasi teknis)
- **Tailwind CSS** untuk styling.
- **shadcn/ui** untuk komponen siap pakai (tombol, form, dialog, tabel admin) yang modern dan konsisten.

### Aksesibilitas
- Kontras warna memadai, teks alternatif (alt text) pada gambar, ukuran tombol nyaman disentuh di HP.

---

## 9. Arsitektur Teknis

### 9.1 Tech Stack

| Lapisan | Pilihan | Alasan |
|---|---|---|
| **Framework** | Next.js (App Router) | Sesuai permintaan; mendukung halaman publik (SEO) + panel admin dalam satu basis kode |
| **Bahasa** | TypeScript | Lebih aman dari error, mudah dirawat |
| **Styling** | Tailwind CSS + shadcn/ui | Cepat, konsisten, modern |
| **Backend / API** | Next.js Server Actions / API Routes | Tidak perlu server backend terpisah |
| **Database** | **PostgreSQL** | Andal, gratis, relasional (cocok untuk kamar–penghuni–pembayaran), mudah di VPS |
| **ORM** | **Prisma** | Ramah pemula, skema jelas, migrasi otomatis, type-safe |
| **Autentikasi** | Auth.js (NextAuth) — credentials provider | Login admin (dan penghuni di P2) yang aman |
| **Penyimpanan file** | Folder di VPS (foto kamar, bukti transfer) | Cukup untuk skala ini; bisa pindah ke object storage bila berkembang |
| **Validasi form** | Zod + React Hook Form | Validasi data booking & admin yang rapi |

### 9.2 Catatan Pilihan Database
- **PostgreSQL (rekomendasi):** pilihan terbaik untuk pertumbuhan & fitur relasional. Jalankan via Docker agar rapi dan mudah di-backup.
- **SQLite (alternatif paling simpel):** untuk 12 kamar dengan trafik rendah, SQLite (file tunggal, tanpa server DB terpisah) sebenarnya **cukup** dan paling mudah di-deploy. Cocok jika ingin meminimalkan kerumitan. Prisma mendukung keduanya — kamu bisa mulai dari SQLite lalu migrasi ke PostgreSQL nanti jika perlu.
- **MySQL/MariaDB:** juga valid jika kamu sudah familiar.

> Saran: jika ragu dan ingin "aman untuk jangka panjang", pilih **PostgreSQL**. Jika ingin "secepat dan sesederhana mungkin untuk rilis pertama", **SQLite** tidak masalah.

### 9.3 Deployment ke VPS

**Komponen yang berjalan di VPS:**
1. Aplikasi Next.js (build production: `next build` → `next start`).
2. Database (PostgreSQL).
3. Reverse proxy: **Nginx** atau **Caddy** (Caddy otomatis mengurus HTTPS).
4. SSL/HTTPS: **Let's Encrypt** (gratis).
5. Process manager: **PM2** (jika native) atau **Docker**.

**Dua pendekatan deployment:**

**A. Docker Compose** *(rekomendasi — rapi & portabel)*
- Satu file `docker-compose.yml` berisi: container app + container PostgreSQL + reverse proxy.
- Gunakan **volume** untuk data database & folder upload agar tidak hilang saat container restart.
- Mudah dipindah ke VPS lain dan mudah di-backup.

**B. Native + PM2** *(lebih sederhana untuk pemula)*
- Install Node.js & PostgreSQL langsung di VPS.
- Jalankan aplikasi dengan PM2 (`pm2 start`) agar tetap hidup & auto-restart.
- Nginx sebagai reverse proxy, Certbot untuk SSL.

**Hal penting lainnya:**
- **Environment variables (`.env`):** `DATABASE_URL`, `NEXTAUTH_SECRET`, dll. **Jangan** di-commit ke Git.
- **Backup otomatis:** jadwalkan `pg_dump` harian (via cron) + backup folder upload (foto & bukti transfer).
- **Spesifikasi VPS minimum:** ±1–2 vCPU dan 2 GB RAM sudah cukup untuk skala 12 kamar.
- **Penyimpanan file upload:** simpan di folder khusus (mis. `/var/www/yasmine/uploads`) yang dipetakan sebagai volume & ikut di-backup.

---

## 10. Model Data (Skema Database)

Entitas utama dan relasinya:

- **User** (admin) — mengelola seluruh sistem.
- **Room** (kamar) — punya banyak **Photo** & **Booking**; punya satu **Tenant** aktif.
- **Booking** — pengajuan dari calon penyewa untuk sebuah kamar.
- **Tenant** (penghuni) — menempati satu kamar; punya banyak **Payment**.
- **Payment** (pembayaran) — tagihan bulanan per penghuni, dengan bukti transfer.
- **Facility** (fasilitas bersama) & **SiteSetting** (konten situs) — pendukung.

Relasi inti: `Room 1—1 Tenant` (penghuni aktif) · `Room 1—* Booking` · `Tenant 1—* Payment`.

### Contoh Skema Prisma (titik awal — silakan disesuaikan)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // ganti "sqlite" jika pakai SQLite
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // simpan HASH, bukan teks asli
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role { ADMIN STAFF }

model Room {
  id           String       @id @default(cuid())
  number       String       @unique          // mis. "A-01"
  category     RoomCategory                   // putra / putri / campur
  monthlyPrice Int                            // sewa per bulan (Rupiah)
  deposit      Int          @default(0)
  size         String?                        // mis. "3x4 m"
  privateBath  Boolean      @default(false)   // kamar mandi dalam
  hasAC        Boolean      @default(false)
  description  String?
  status       RoomStatus   @default(AVAILABLE)
  facilities   String[]                       // mis. ["WiFi","Lemari","Kasur"]
  photos       Photo[]
  bookings     Booking[]
  tenant       Tenant?                        // penghuni saat ini
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

enum RoomCategory { PUTRA PUTRI CAMPUR }
enum RoomStatus { AVAILABLE OCCUPIED MAINTENANCE }

model Photo {
  id      String  @id @default(cuid())
  url     String
  caption String?
  room    Room    @relation(fields: [roomId], references: [id], onDelete: Cascade)
  roomId  String
}

model Booking {
  id         String        @id @default(cuid())
  room       Room          @relation(fields: [roomId], references: [id])
  roomId     String
  name       String
  phone      String
  email      String?
  moveInDate DateTime
  message    String?
  status     BookingStatus @default(PENDING)
  createdAt  DateTime      @default(now())
}

enum BookingStatus { PENDING APPROVED REJECTED CANCELLED CONVERTED }

model Tenant {
  id               String       @id @default(cuid())
  name             String
  phone            String
  email            String?
  idCardNumber     String?      // No. KTP
  emergencyContact String?
  room             Room         @relation(fields: [roomId], references: [id])
  roomId           String       @unique        // 1 kamar = 1 penghuni aktif
  moveInDate       DateTime
  contractEndDate  DateTime?
  status           TenantStatus @default(ACTIVE)
  payments         Payment[]
  createdAt        DateTime     @default(now())
}

enum TenantStatus { ACTIVE INACTIVE }

model Payment {
  id          String        @id @default(cuid())
  tenant      Tenant        @relation(fields: [tenantId], references: [id])
  tenantId    String
  periodMonth Int                              // 1–12
  periodYear  Int
  amount      Int
  dueDate     DateTime
  paidDate    DateTime?
  proofUrl    String?                          // bukti transfer
  status      PaymentStatus @default(UNPAID)
  notes       String?
  createdAt   DateTime      @default(now())
}

enum PaymentStatus { UNPAID PENDING_VERIFICATION PAID OVERDUE }

model Facility {
  id          String  @id @default(cuid())
  name        String
  icon        String?
  description String?
}

model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}
```

---

## 11. Persyaratan Non-Fungsional

| Aspek | Persyaratan |
|---|---|
| **Responsif** | Tampil baik di HP, tablet, desktop (mobile-first) |
| **Performa** | Halaman publik cepat dimuat; gambar dioptimasi (Next.js Image) |
| **SEO** | Meta tag, judul deskriptif, sitemap — agar mudah ditemukan di Google |
| **Keamanan** | Password admin di-hash, halaman admin terproteksi, validasi input, HTTPS aktif |
| **Keandalan** | Auto-restart aplikasi (PM2/Docker), backup database & file rutin |
| **Privasi** | Data pribadi penghuni (KTP, kontak) hanya dapat diakses admin |

---

## 12. Roadmap / Rencana Rilis

| Fase | Fokus | Isi |
|---|---|---|
| **MVP** | Rilis pertama | Etalase publik lengkap, form booking, panel admin (kamar, booking, penghuni, pembayaran manual), deploy ke VPS |
| **Phase 2** | Otomatisasi & kenyamanan | Reminder pembayaran, invoice PDF, laporan keuangan, portal penghuni, galeri, FAQ, testimoni, pengaturan konten |
| **Phase 3** | Pengembangan lanjutan | Payment gateway (Midtrans/Xendit), multi-properti, notifikasi push, blog/SEO |

---

## 13. Risiko & Pertimbangan

- **Kualitas foto:** website akan kurang menjual tanpa foto kamar yang baik — siapkan foto berkualitas sejak awal.
- **Verifikasi pembayaran manual:** karena bukti transfer diverifikasi admin, butuh kedisiplinan rutin mengecek. (Reminder otomatis di P2 membantu.)
- **Backup VPS:** kehilangan data karena tidak ada backup adalah risiko nyata — backup otomatis wajib sejak awal.
- **Skema data:** struktur disiapkan agar mudah berkembang ke multi-properti, namun jangan over-engineer di awal — fokus ke MVP dulu.

---

## 14. Pertanyaan Terbuka (untuk diisi pemilik)

- Apakah ada **kategori kamar baku** (mis. tipe A/B/C dengan harga tetap), atau setiap kamar diatur harga individual?
- Berapa **durasi minimal sewa** (bulanan/3 bulan/tahunan)?
- Apakah perlu **deposit**? Berapa besarnya?
- Detail **rekening transfer** dan **kontak WhatsApp** resmi.
- Apakah ada **logo / identitas visual** yang sudah ada untuk Yasmine Kost?

---

*Dokumen ini adalah titik awal. Skema database, daftar fitur, dan prioritas dapat disesuaikan seiring kebutuhan berkembang.*