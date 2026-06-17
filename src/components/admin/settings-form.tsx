"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateSettings,
  type SettingsFormState,
} from "@/app/admin/(panel)/pengaturan/actions";

type Values = Record<string, string>;

export function SettingsForm({ values }: { values: Values }) {
  const [state, formAction, isPending] = useActionState<
    SettingsFormState,
    FormData
  >(updateSettings, { ok: false });

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state.ok && (
        <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>Pengaturan berhasil disimpan.</span>
        </div>
      )}

      {/* Identitas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="siteName">Nama situs *</Label>
          <Input id="siteName" name="siteName" defaultValue={values.siteName} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startingPrice">Harga &quot;mulai dari&quot; (Rp)</Label>
          <Input
            id="startingPrice"
            name="startingPrice"
            type="number"
            min={0}
            step={50000}
            defaultValue={values.startingPrice}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tagline">Tagline</Label>
        <Textarea
          id="tagline"
          name="tagline"
          rows={2}
          defaultValue={values.tagline}
        />
      </div>

      {/* Kontak */}
      <div className="border-t pt-5">
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Kontak
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">No. telepon (tampil)</Label>
            <Input id="phone" name="phone" defaultValue={values.phone} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">WhatsApp (format internasional)</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={values.whatsapp}
              placeholder="628125679294"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={values.email} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" name="address" defaultValue={values.address} />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="mapsEmbedUrl">URL Embed Google Maps</Label>
          <Input
            id="mapsEmbedUrl"
            name="mapsEmbedUrl"
            defaultValue={values.mapsEmbedUrl}
            placeholder="https://www.google.com/maps?q=...&output=embed"
          />
          <p className="text-xs text-muted-foreground">
            Di Google Maps: bagikan → sematkan peta → salin URL di dalam{" "}
            <code>src=&quot;...&quot;</code>. Atau gunakan{" "}
            <code>https://www.google.com/maps?q=ALAMAT&amp;output=embed</code>.
          </p>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="nearbyInfo">Info sekitar</Label>
          <Textarea
            id="nearbyInfo"
            name="nearbyInfo"
            rows={2}
            defaultValue={values.nearbyInfo}
          />
        </div>
      </div>

      {/* Rekening */}
      <div className="border-t pt-5">
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Rekening transfer
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="bankName">Nama bank</Label>
            <Input id="bankName" name="bankName" defaultValue={values.bankName} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bankAccountNumber">No. rekening</Label>
            <Input
              id="bankAccountNumber"
              name="bankAccountNumber"
              defaultValue={values.bankAccountNumber}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bankAccountHolder">Atas nama</Label>
            <Input
              id="bankAccountHolder"
              name="bankAccountHolder"
              defaultValue={values.bankAccountHolder}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Simpan Pengaturan
      </Button>
    </form>
  );
}
