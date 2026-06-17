"use client";

import { useState, useTransition } from "react";
import { Check, X, UserPlus, Ban, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  approveBooking,
  rejectBooking,
  convertBooking,
  cancelBooking,
  deleteBooking,
} from "@/app/admin/(panel)/booking/actions";

export function BookingActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    description: string;
    isDestructive: boolean;
    confirmLabel: string;
    action: () => Promise<void> | void;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleOpenConfirm = (config: {
    title: string;
    description: string;
    isDestructive: boolean;
    confirmLabel: string;
    action: () => Promise<void> | void;
  }) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  const handleAction = (
    actionFn: (formData: FormData) => Promise<void> | void,
    title: string,
    description: string,
    confirmLabel: string,
    isDestructive = false
  ) => {
    handleOpenConfirm({
      title,
      description,
      confirmLabel,
      isDestructive,
      action: async () => {
        const formData = new FormData();
        formData.append("id", id);
        await actionFn(formData);
      },
    });
  };

  const handleDirectAction = (actionFn: (formData: FormData) => Promise<void> | void) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);
      await actionFn(formData);
    });
  };

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {status === "PENDING" && (
        <>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleDirectAction(approveBooking)}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
            Setujui
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              handleAction(
                rejectBooking,
                "Tolak Booking",
                "Apakah Anda yakin ingin menolak pengajuan booking ini?",
                "Tolak Booking",
                true
              )
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            <X className="size-3.5" /> Tolak
          </button>
        </>
      )}

      {(status === "PENDING" || status === "APPROVED") && (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            handleAction(
              convertBooking,
              "Jadikan Penghuni",
              "Apakah Anda yakin ingin menjadikan pemohon sebagai penghuni aktif? Kamar kost akan ditandai TERISI dan booking lainnya pada kamar ini otomatis dibatalkan.",
              "Jadikan Penghuni",
              false
            )
          }
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <UserPlus className="size-3.5" /> Jadi Penghuni
        </button>
      )}

      {status === "APPROVED" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            handleAction(
              cancelBooking,
              "Batalkan Booking",
              "Apakah Anda yakin ingin membatalkan booking yang sudah disetujui ini?",
              "Batalkan",
              true
            )
          }
          className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
        >
          <Ban className="size-3.5" /> Batal
        </button>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          handleAction(
            deleteBooking,
            "Hapus Booking",
            "Apakah Anda yakin ingin menghapus data booking ini secara permanen dari database? Tindakan ini tidak dapat dibatalkan.",
            "Hapus Permanen",
            true
          )
        }
        className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
      >
        <Trash2 className="size-3.5" /> Hapus
      </button>

      {/* Custom Confirmation Modal */}
      {modalOpen && modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex gap-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                  modalConfig.isDestructive
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {modalConfig.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {modalConfig.description}
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
                variant={modalConfig.isDestructive ? "destructive" : "default"}
                size="sm"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await modalConfig.action();
                    setModalOpen(false);
                  });
                }}
              >
                {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                {modalConfig.confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
