"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  createTenant,
  type TenantFormState,
} from "@/app/admin/(panel)/penghuni/actions";

type RoomOption = {
  id: string;
  number: string;
  name: string | null;
};

export function NewTenantForm({ rooms }: { rooms: RoomOption[] }) {
  const [state, formAction, isPending] = useActionState<
    TenantFormState,
    FormData
  >(createTenant, { ok: false });
  const err = (f: string) => state.fieldErrors?.[f];

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state.ok && (
        <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>Penghuni baru berhasil didaftarkan.</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="roomId">Pilih Kamar *</Label>
          <Select id="roomId" name="roomId" required defaultValue="">
            <option value="" disabled>-- Pilih Kamar Tersedia --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Kamar {room.number} {room.name ? `(${room.name})` : ""}
              </option>
            ))}
          </Select>
          {err("roomId") && (
            <p className="text-xs text-destructive">{err("roomId")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="moveInDate">Tanggal Masuk *</Label>
          <Input id="moveInDate" name="moveInDate" type="date" required />
          {err("moveInDate") && (
            <p className="text-xs text-destructive">{err("moveInDate")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input id="name" name="name" required placeholder="Nama Penghuni" />
          {err("name") && <p className="text-xs text-destructive">{err("name")}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">No. HP / WhatsApp *</Label>
          <Input id="phone" name="phone" required placeholder="08xxxxxxxxxx" />
          {err("phone") && (
            <p className="text-xs text-destructive">{err("phone")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@penghuni.com (opsional)"
          />
          {err("email") && (
            <p className="text-xs text-destructive">{err("email")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="idCardNumber">No. KTP</Label>
          <Input
            id="idCardNumber"
            name="idCardNumber"
            placeholder="No. KTP (opsional)"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="emergencyContact">Kontak Darurat</Label>
          <Input
            id="emergencyContact"
            name="emergencyContact"
            placeholder="Nama & no. HP keluarga (opsional)"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contractEndDate">Kontrak Berakhir</Label>
          <Input id="contractEndDate" name="contractEndDate" type="date" />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Daftarkan Penghuni
        </Button>
      </div>
    </form>
  );
}
