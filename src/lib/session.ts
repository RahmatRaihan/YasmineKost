import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "yk_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 8) {
    throw new Error(
      "AUTH_SECRET belum di-set. Tambahkan AUTH_SECRET di file .env (string acak panjang)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function decryptSession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.userId || !payload.email) return null;
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name ?? ""),
      role: String(payload.role ?? "ADMIN"),
    };
  } catch {
    return null;
  }
}

/** Buat sesi & set cookie (dipanggil di server action setelah login berhasil). */
export async function createSessionCookie(payload: SessionPayload) {
  const token = await encryptSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Baca payload sesi dari cookie (server component / server action). */
export async function getSessionPayload(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decryptSession(store.get(SESSION_COOKIE)?.value);
}
