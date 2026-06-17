"use client";

import { useState, useTransition } from "react";
import { LogOut, AlertTriangle, Loader2 } from "lucide-react";
import { checkoutTenant } from "@/app/admin/(panel)/penghuni/actions";
import { Button } from "@/components/ui/button";

export function CheckoutTenantButton({ tenantId }: { tenantId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", tenantId);
      await checkoutTenant(formData);
      setModalOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
      >
        <LogOut className="size-4" /> Tandai Keluar
      </button>

      {/* Custom Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Tandai Penghuni Keluar
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Apakah Anda yakin ingin menandai penghuni ini keluar? Kamar kost akan secara otomatis tersedia kembali untuk disewa.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={handleCheckout}
              >
                {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                Tandai Keluar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
