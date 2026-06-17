import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Harus sama dengan SESSION_COOKIE di src/lib/session.ts. Di-inline di sini
// agar middleware (Edge) tidak mengimpor modul server-only.
const SESSION_COOKIE = "yk_session";

// Middleware berjalan di Edge Runtime: verifikasi JWT pakai jose (edge-safe).
// Verifikasi penuh kredensial tetap dilakukan di server action (Node).
async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const valid = await hasValidSession(req);

  // Sudah login tapi membuka halaman login -> arahkan ke dashboard.
  if (isLogin && valid) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Halaman admin (selain login) wajib punya sesi valid.
  if (!isLogin && !valid) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
