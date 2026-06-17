# Yasmine Kost — Website & Sistem Manajemen Kost

Website etalase publik + panel admin untuk **Yasmine Kost**, dibangun sesuai
[`prd.md`](./prd.md). Calon penyewa dapat melihat kamar, fasilitas, lokasi, dan
melakukan **booking online**; admin mengelola kamar, booking, penghuni, dan
pembayaran (manual via transfer + bukti) dari satu panel.

## ✨ Fitur (MVP)

**Publik**
- Beranda dengan ketersediaan kamar terkini, CTA Booking & WhatsApp
- Daftar kamar dengan filter kategori (putra/putri/campur) & ketersediaan
- Detail kamar: galeri foto, harga, deposit, fasilitas, **form booking**
- Halaman Fasilitas, Lokasi (peta Google Maps), Peraturan, Kontak
- Halaman konfirmasi booking + instruksi pembayaran (rekening + WhatsApp)
- Responsif / mobile-first, SEO dasar (metadata, `sitemap.xml`, `robots.txt`)

**Admin** (`/admin`, terproteksi login)
- Dashboard: hunian, occupancy rate, booking menunggu, tagihan jatuh tempo, estimasi pendapatan
- Manajemen Kamar: tambah/edit/hapus, status, **upload foto**
- Manajemen Booking: setujui / tolak / konversi jadi penghuni
- Manajemen Penghuni: data penghuni, kontrak, riwayat pembayaran, checkout
- Manajemen Pembayaran: buat tagihan (per penghuni / generate sebulan untuk semua), verifikasi bukti transfer, tandai lunas

## 🧱 Tech Stack

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v3 + komponen ala shadcn/ui |
| Database | SQLite (default) via Prisma — mudah dipindah ke PostgreSQL |
| ORM | Prisma |
| Auth | Sesi JWT (cookie httpOnly, `jose`) + password hash `bcryptjs` |
| Validasi | Zod |
| Ikon | lucide-react |

## 🚀 Menjalankan secara lokal

Prasyarat: **Node.js 18+** (diuji pada Node 24).

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment
cp .env.example .env        # lalu sesuaikan nilainya bila perlu

# 3. Buat database & data awal (12 kamar, admin, fasilitas, pengaturan)
npm run db:migrate          # membuat SQLite + menjalankan seed
#   (atau: npm run db:push && npm run db:seed)

# 4. Jalankan
npm run dev                 # http://localhost:3000
```

### Login admin (default dari seed)
- URL: `http://localhost:3000/admin/login`
- Email: `admin@yasminekost.com`
- Password: `admin12345`

> Ubah kredensial admin lewat variabel `ADMIN_EMAIL` / `ADMIN_PASSWORD` di `.env`
> sebelum menjalankan seed, atau ganti password langsung di database.

## 🔧 Environment Variables

Lihat [`.env.example`](./.env.example). Yang penting:

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Koneksi DB. Default SQLite `file:./dev.db`. |
| `AUTH_SECRET` | **Wajib diganti di produksi.** Kunci penandatangan sesi (mis. `openssl rand -base64 32`). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Akun admin yang dibuat saat seeding. |
| `UPLOAD_DIR` | Folder penyimpanan foto kamar & bukti transfer (default `./uploads`). |
| `NEXT_PUBLIC_SITE_URL` | URL publik untuk metadata & sitemap. |

## 📁 Struktur Proyek

```
prisma/
  schema.prisma        # model: User, Room, Photo, Booking, Tenant, Payment, Facility, SiteSetting
  seed.ts              # data awal
src/
  app/
    (public)/          # halaman publik (beranda, kamar, fasilitas, lokasi, dst.)
    admin/
      login/           # halaman login (di luar guard)
      (panel)/         # halaman admin terproteksi + layout guard
    api/uploads/       # streaming file upload (di luar /public)
    sitemap.ts, robots.ts, not-found.tsx
  components/
    ui/                # primitive ala shadcn (button, card, input, table, ...)
    public/            # komponen sisi publik (header, footer, room-card, ...)
    admin/             # komponen panel admin (shell, form, actions, ...)
  lib/                 # prisma, auth, session, uploads, settings, utils, constants
  middleware.ts        # proteksi route /admin/*
uploads/               # file upload (di-gitignore; petakan ke volume di VPS)
```

## 🗄️ Database

Skema mengikuti model data di PRD. Karena SQLite tidak mendukung tipe list,
field `Room.facilities` disimpan sebagai **JSON string** (dibantu helper
`parseFacilities`). Perintah berguna:

```bash
npm run db:studio     # buka Prisma Studio (lihat/edit data)
npm run db:migrate    # buat & terapkan migrasi + seed
```

### Pindah ke PostgreSQL
1. Ubah `provider = "postgresql"` di `prisma/schema.prisma`.
2. Set `DATABASE_URL` ke koneksi Postgres.
3. (Opsional) ubah `facilities` menjadi `String[]` jika ingin tipe list native.
4. Jalankan `npm run db:migrate`.

## 🌐 Deployment ke VPS

`next.config.mjs` memakai `output: "standalone"` sehingga mudah dijalankan.

**Opsi A — Native + PM2**
```bash
npm install
npm run build
# set .env produksi (AUTH_SECRET kuat, DATABASE_URL, UPLOAD_DIR absolut, dll.)
npx prisma migrate deploy && npm run db:seed   # seed cukup sekali
pm2 start "npm run start" --name yasmine-kost
```
Pasang **Nginx/Caddy** sebagai reverse proxy + **Let's Encrypt** untuk HTTPS.

**Opsi B — Docker Compose**
Bungkus app (Node) + (opsional) PostgreSQL dalam container. Petakan **volume**
untuk database dan untuk `UPLOAD_DIR` agar foto & bukti transfer tidak hilang.

**Wajib sejak awal:**
- `AUTH_SECRET` produksi yang acak & panjang; jangan commit `.env`.
- **Backup otomatis**: file SQLite / `pg_dump` harian + folder `uploads/`.

## 📌 Catatan keputusan teknis (vs PRD)

- **SQLite** dipakai sebagai default (PRD mengizinkan untuk rilis pertama yang
  paling sederhana). Siap dimigrasi ke PostgreSQL.
- **Auth**: alih-alih Auth.js (NextAuth) yang masih beta untuk App Router,
  dipakai sesi JWT ringan (cookie httpOnly + `bcryptjs`). Memenuhi syarat
  keamanan PRD: password di-hash, route admin terproteksi, siap HTTPS.
- **shadcn/ui**: komponen ditulis tangan mengikuti konvensi shadcn (folder
  `components/ui`) agar build deterministik tanpa CLI.

## 🛣️ Belum termasuk (Phase 2/3 di PRD)
Reminder pembayaran otomatis, invoice/kuitansi PDF, laporan keuangan ekspor,
portal penghuni, galeri/FAQ/testimoni, pengaturan konten via UI, dan payment
gateway. Skema data sudah disiapkan agar mudah dikembangkan.
