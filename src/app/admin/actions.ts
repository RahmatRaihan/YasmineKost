"use server";

import { redirect } from "next/navigation";
import { verifyCredentials } from "@/lib/auth";
import { createSessionCookie, destroySessionCookie } from "@/lib/session";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: "Email atau password salah." };
  }

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Hanya izinkan redirect internal ke area admin.
  const target = next.startsWith("/admin") ? next : "/admin";
  redirect(target);
}

export async function logout() {
  await destroySessionCookie();
  redirect("/admin/login");
}
