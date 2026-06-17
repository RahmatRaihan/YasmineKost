"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Undo2, Upload, FileText, Trash2, AlertTriangle, Loader2, MessageCircle } from "lucide-react";
import {
  markPaid,
  markUnpaid,
  deletePayment,
  uploadPaymentProof,
} from "@/app/admin/(panel)/pembayaran/actions";
import { Button } from "@/components/ui/button";

export function PaymentActions({
  id,
  status,
  proofUrl,
  whatsappUrl,
}: {
  id: string;
  status: string;
  proofUrl: string | null;
  whatsappUrl?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);
      await deletePayment(formData);
      setModalOpen(false);
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {proofUrl && (
        <a
          href={proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <FileText className="size-3.5" /> Bukti
        </a>
      )}

      {/* Upload bukti transfer */}
      <form ref={uploadFormRef} action={uploadPaymentProof}>
        <input type="hidden" name="id" value={id} />
        <input
          ref={fileRef}
          type="file"
          name="proof"
          accept="image/*"
          className="hidden"
          onChange={() => uploadFormRef.current?.requestSubmit()}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <Upload className="size-3.5" /> {proofUrl ? "Ganti" : "Bukti"}
        </button>
      </form>

      {status !== "PAID" && whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Kirim pengingat WhatsApp"
          className="inline-flex items-center gap-1.5 rounded-md border border-[#25D366]/30 bg-[#25D366]/5 px-2.5 py-1.5 text-xs font-medium text-[#25D366] hover:bg-[#25D366]/10"
        >
          <MessageCircle className="size-3.5" /> WA
        </a>
      )}

      {status !== "PAID" ? (
        <form action={markPaid}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
          >
            <Check className="size-3.5" /> Lunas
          </button>
        </form>
      ) : (
        <form action={markUnpaid}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Undo2 className="size-3.5" /> Batal lunas
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Hapus tagihan"
        className="inline-flex items-center rounded-md px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-3.5" />
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
                  Hapus Tagihan
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Apakah Anda yakin ingin menghapus tagihan pembayaran ini secara permanen dari database? Tindakan ini tidak dapat dibatalkan.
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
                onClick={handleDelete}
              >
                {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                Hapus Tagihan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
