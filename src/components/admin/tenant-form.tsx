"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateTenant,
  type TenantFormState,
} from "@/app/admin/(panel)/penghuni/actions";

type TenantInitial = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  idCardNumber: string | null;
  emergencyContact: string | null;
  contractEndDate: string | null; // yyyy-mm-dd
};

export function TenantForm({ initial }: { initial: TenantInitial }) {
  const [state, formAction, isPending] = useActionState<
    TenantFormState,
    FormData
  >(updateTenant, { ok: false });
  const err = (f: string) => state.fieldErrors?.[f];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={initial.id} />

      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state.ok && (
        <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>Data penghuni berhasil disimpan.</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nama *</Label>
          <Input id="name" name="name" defaultValue={initial.name} required />
          {err("name") && <p className="text-xs text-destructive">{err("name")}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">No. HP / WhatsApp *</Label>
          <Input id="phone" name="phone" defaultValue={initial.phone} required />
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
            defaultValue={initial.email ?? ""}
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
            defaultValue={initial.idCardNumber ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emergencyContact">Kontak darurat</Label>
          <Input
            id="emergencyContact"
            name="emergencyContact"
            defaultValue={initial.emergencyContact ?? ""}
            placeholder="Nama & no. HP keluarga"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contractEndDate">Kontrak berakhir</Label>
          <Input
            id="contractEndDate"
            name="contractEndDate"
            type="date"
            defaultValue={initial.contractEndDate ?? ""}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Simpan Data
      </Button>
    </form>
  );
}
