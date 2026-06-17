"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  createBooking,
  type BookingFormState,
} from "@/app/(public)/kamar/[id]/actions";

const initialState: BookingFormState = { ok: false };

export function BookingForm({ roomId }: { roomId: string }) {
  const [state, formAction, isPending] = useActionState(
    createBooking,
    initialState
  );

  const today = new Date().toISOString().split("T")[0];
  const err = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="roomId" value={roomId} />

      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Nama lengkap *</Label>
        <Input id="name" name="name" placeholder="Nama kamu" required />
        {err("name") && <p className="text-xs text-destructive">{err("name")}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">No. WhatsApp / HP *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            required
          />
          {err("phone") && (
            <p className="text-xs text-destructive">{err("phone")}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email (opsional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@contoh.com"
          />
          {err("email") && (
            <p className="text-xs text-destructive">{err("email")}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="moveInDate">Rencana tanggal masuk *</Label>
        <Input
          id="moveInDate"
          name="moveInDate"
          type="date"
          min={today}
          required
        />
        {err("moveInDate") && (
          <p className="text-xs text-destructive">{err("moveInDate")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="durationMonths">Lama sewa *</Label>
        <Select id="durationMonths" name="durationMonths" defaultValue="1">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m} bulan
            </option>
          ))}
        </Select>
        <p className="text-xs text-muted-foreground">
          Sewa dihitung per bulan — pilih perkiraan lama Anda menyewa.
        </p>
        {err("durationMonths") && (
          <p className="text-xs text-destructive">{err("durationMonths")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Catatan (opsional)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Pertanyaan atau permintaan khusus…"
          rows={3}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {isPending ? "Mengirim…" : "Kirim Booking"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Dengan mengirim booking, kamu menyetujui peraturan kost. Admin akan
        menghubungi untuk verifikasi & info pembayaran.
      </p>
    </form>
  );
}
