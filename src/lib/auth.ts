import "server-only";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionPayload, type SessionPayload } from "@/lib/session";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Verifikasi email + password terhadap database. */
export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user) return null;
  const ok = await verifyPassword(password, user.password);
  if (!ok) return null;
  return user;
}

/** Ambil sesi saat ini (atau null). */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  return getSessionPayload();
}

/**
 * Pastikan ada admin yang login. Jika tidak, redirect ke halaman login.
 * Dipakai sebagai guard di server component halaman admin.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSessionPayload();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
