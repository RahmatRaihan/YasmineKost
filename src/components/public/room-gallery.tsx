"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomGallery({
  photos,
  alt,
}: {
  photos: { id: string; url: string; caption: string | null }[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="size-10" />
          <span className="text-sm">Belum ada foto</span>
        </div>
      </div>
    );
  }

  const current = photos[Math.min(active, photos.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted">
        <Image
          src={current.url}
          alt={current.caption || alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border",
                i === active
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-80 hover:opacity-100"
              )}
            >
              <Image
                src={p.url}
                alt={p.caption || `${alt} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
