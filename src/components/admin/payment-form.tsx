"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  createPayment,
  type PaymentFormState,
} from "@/app/admin/(panel)/pembayaran/actions";
import { monthName } from "@/lib/utils";

type TenantOption = {
  id: string;
  name: string;
  roomNumber: string;
  monthlyPrice: number;
};

export function PaymentForm({
  tenants,
  defaultTenantId,
  currentMonth,
  currentYear,
}: {
  tenants: TenantOption[];
  defaultTenantId?: string;
  currentMonth: number;
  currentYear: number;
}) {
  const [state, formAction, isPending] = useActionState<
    PaymentFormState,
    FormData
  >(createPayment, { ok: false });

  const initialId =
    defaultTenantId && tenants.some((t) => t.id === defaultTenantId)
      ? defaultTenantId
      : tenants[0]?.id;
  const [tenantId, setTenantId] = useState(initialId);

  const selected = useMemo(
    () => tenants.find((t) => t.id === tenantId),
    [tenants, tenantId]
  );
  const [amount, setAmount] = useState<number>(selected?.monthlyPrice ?? 0);

  const err = (f: string) => state.fieldErrors?.[f];
  const defaultDue = `${currentYear}-${String(currentMonth).padStart(2, "0")}-05`;

  if (tenants.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Belum ada penghuni aktif. Tagihan hanya bisa dibuat untuk penghuni aktif.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="tenantId">Penghuni *</Label>
        <Select
          id="tenantId"
          name="tenantId"
          value={tenantId}
          onChange={(e) => {
            setTenantId(e.target.value);
            const t = tenants.find((x) => x.id === e.target.value);
            if (t) setAmount(t.monthlyPrice);
          }}
        >
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — Kamar {t.roomNumber}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="periodMonth">Bulan *</Label>
          <Select id="periodMonth" name="periodMonth" defaultValue={currentMonth}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {monthName(m)}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="periodYear">Tahun *</Label>
          <Input
            id="periodYear"
            name="periodYear"
            type="number"
            defaultValue={currentYear}
            min={2020}
            max={2100}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="amount">Jumlah (Rp) *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step={50000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
          {err("amount") && (
            <p className="text-xs text-destructive">{err("amount")}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dueDate">Jatuh tempo *</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaultDue}
            required
          />
          {err("dueDate") && (
            <p className="text-xs text-destructive">{err("dueDate")}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Catatan (opsional)</Label>
        <Input id="notes" name="notes" placeholder="mis. termasuk token listrik" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Buat Tagihan
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href="/admin/pembayaran">Batal</Link>
        </Button>
      </div>
    </form>
  );
}
