"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  ROOM_CATEGORIES,
  ROOM_CATEGORY_LABEL,
  ROOM_STATUSES,
  ROOM_STATUS_LABEL,
  COMMON_ROOM_FACILITIES,
} from "@/lib/constants";
import type { RoomFormState } from "@/app/admin/(panel)/kamar/actions";

type RoomInitial = {
  id?: string;
  number?: string;
  name?: string | null;
  category?: string;
  monthlyPrice?: number;
  deposit?: number;
  size?: string | null;
  status?: string;
  description?: string | null;
  facilities?: string[];
};

export function RoomForm({
  action,
  initial = {},
  submitLabel = "Simpan",
  showPhotoUpload = false,
}: {
  action: (prev: RoomFormState, formData: FormData) => Promise<RoomFormState>;
  initial?: RoomInitial;
  submitLabel?: string;
  showPhotoUpload?: boolean;
}) {
  const [state, formAction, isPending] = useActionState<RoomFormState, FormData>(
    action,
    { ok: false }
  );
  const err = (f: string) => state.fieldErrors?.[f];
  const facilities = initial.facilities ?? [];

  return (
    <form action={formAction} className="space-y-6">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="number">Nomor kamar *</Label>
          <Input
            id="number"
            name="number"
            defaultValue={initial.number}
            placeholder="A-01"
            required
          />
          {err("number") && (
            <p className="text-xs text-destructive">{err("number")}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nama kamar (opsional)</Label>
          <Input
            id="name"
            name="name"
            defaultValue={initial.name ?? ""}
            placeholder="Kamar Melati"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            id="category"
            name="category"
            defaultValue={initial.category ?? "CAMPUR"}
          >
            {ROOM_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {ROOM_CATEGORY_LABEL[c]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            name="status"
            defaultValue={initial.status ?? "AVAILABLE"}
          >
            {ROOM_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ROOM_STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="monthlyPrice">Sewa per bulan (Rp) *</Label>
          <Input
            id="monthlyPrice"
            name="monthlyPrice"
            type="number"
            min={0}
            step={50000}
            defaultValue={initial.monthlyPrice ?? 0}
            required
          />
          {err("monthlyPrice") && (
            <p className="text-xs text-destructive">{err("monthlyPrice")}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="deposit">Deposit (Rp)</Label>
          <Input
            id="deposit"
            name="deposit"
            type="number"
            min={0}
            step={50000}
            defaultValue={initial.deposit ?? 0}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="size">Ukuran</Label>
          <Input
            id="size"
            name="size"
            defaultValue={initial.size ?? ""}
            placeholder="3x4 m"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initial.description ?? ""}
          rows={4}
          placeholder="Deskripsi kamar, suasana, keunggulan…"
        />
      </div>

      <div className="space-y-2">
        <Label>Fasilitas kamar</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {COMMON_ROOM_FACILITIES.map((f) => (
            <label
              key={f}
              className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="checkbox"
                name="facilities"
                value={f}
                defaultChecked={facilities.includes(f)}
                className="size-4 accent-[hsl(var(--primary))]"
              />
              {f}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Mencentang &quot;AC&quot; / &quot;Kamar Mandi Dalam&quot; otomatis
          menandai kamar ber-AC / KM dalam.
        </p>
      </div>

      {showPhotoUpload && (
        <div className="space-y-1.5">
          <Label htmlFor="photos">Foto kamar (opsional)</Label>
          <Input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
          />
          <p className="text-xs text-muted-foreground">
            Bisa pilih beberapa foto sekaligus. JPG/PNG/WEBP, maks 5 MB per
            file. Foto juga dapat ditambah atau diatur lagi nanti di halaman
            edit kamar.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href="/admin/kamar">Batal</Link>
        </Button>
      </div>
    </form>
  );
}
