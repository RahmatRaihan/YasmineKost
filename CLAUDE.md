# CLAUDE.md — Yasmine Kost

Website etalase + sistem manajemen kost (lihat `prd.md`). Next.js 15 (App
Router) + TypeScript + Tailwind v3 + Prisma (SQLite) + auth sesi JWT.

## Perintah
- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — `prisma generate` + `next build`
- `npm run db:migrate` — buat/terapkan migrasi lalu seed
- `npm run db:push` / `npm run db:seed` / `npm run db:studio`
- Login admin default: `admin@yasminekost.com` / `admin12345` (dari `.env`)

## Arsitektur
- **Routing**: `src/app/(public)/*` halaman publik; `src/app/admin/login` di luar
  guard; `src/app/admin/(panel)/*` halaman admin dengan layout guard
  (`requireAdmin()`); `src/middleware.ts` melindungi `/admin/*` (verifikasi JWT
  edge-safe via `jose`).
- **Auth**: `src/lib/session.ts` (mint/verify JWT, cookie `yk_session`),
  `src/lib/auth.ts` (`bcryptjs`, `verifyCredentials`, `requireAdmin`). Server
  action login/logout di `src/app/admin/actions.ts`.
- **Data**: Prisma di `src/lib/prisma.ts`. Model di `prisma/schema.prisma`.
  Provider **sqlite** → `Room.facilities` disimpan sebagai **JSON string**
  (pakai `parseFacilities` dari `src/lib/utils.ts`). Status disimpan sebagai
  string; label/varian badge di `src/lib/constants.ts` & `components/status-badge.tsx`.
- **Mutasi**: pakai **Server Actions** per modul (`.../actions.ts`) +
  `revalidatePath`. Form publik/admin memakai `useActionState`.
- **Upload**: file disimpan di `UPLOAD_DIR` (default `./uploads`, di luar
  `/public`) lewat `src/lib/uploads.ts`; disajikan via route streaming
  `src/app/api/uploads/[...path]/route.ts`. URL tersimpan sebagai
  `/api/uploads/<sub>/<file>`.
- **Pengaturan situs**: key-value `SiteSetting`, dibaca via
  `src/lib/settings.ts` (`getSiteSettings`, default + override DB).
- **UI**: primitive ala shadcn di `src/components/ui/*` (Slot custom, tanpa
  Radix). Warna via CSS variable di `globals.css` (palet sage/gold/krem).

## Konvensi
- Teks UI berbahasa Indonesia.
- Mata uang: `formatRupiah`; tanggal: `formatDate` / `monthName` (`src/lib/utils.ts`).
- Tambah enum/status baru: perbarui `src/lib/constants.ts` + `status-badge.tsx`.
- Halaman publik yang menampilkan data dinamis (mis. beranda) pakai
  `export const dynamic = "force-dynamic"`; layout panel admin sudah
  `force-dynamic`.

## Catatan
- ESLint diabaikan saat build (`next.config.mjs`) — belum dikonfigurasi.
- Font Inter/Poppins via `<link>` Google Fonts di root layout (bukan
  `next/font`) agar build tak bergantung fetch font.
- Jangan commit `.env`, `prisma/*.db`, atau isi `uploads/`.
