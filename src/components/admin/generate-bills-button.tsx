"use client";

import { useState, useTransition } from "react";
import { CalendarPlus, AlertTriangle, Loader2 } from "lucide-react";
import { generateMonthlyBills } from "@/app/admin/(panel)/pembayaran/actions";
import { Button } from "@/components/ui/button";

export function GenerateBillsButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      await generateMonthlyBills();
      setModalOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        <CalendarPlus className="size-4" /> Tagihan bulan ini
      </button>

      {/* Custom Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Generate Tagihan Bulanan
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Apakah Anda yakin ingin membuat tagihan bulan ini untuk semua penghuni aktif yang belum ditagih?
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
                variant="default"
                size="sm"
                disabled={isPending}
                onClick={handleGenerate}
              >
                {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                Buat Tagihan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
