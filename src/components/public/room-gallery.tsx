"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomGallery({
  photos,
  alt,
}: {
  photos: { id: string; url: string; caption: string | null }[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Handle keypress events for navigation and closing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowRight" && photos.length > 1) {
        setActive((prev) => (prev + 1) % photos.length);
      } else if (e.key === "ArrowLeft" && photos.length > 1) {
        setActive((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, photos.length]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      {/* Main Image Container */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted cursor-zoom-in group"
      >
        <Image
          src={current.url}
          alt={current.caption || alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority
        />
        {/* Subtle hover overlay prompt */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide shadow-md backdrop-blur-sm">
            Klik untuk memperbesar
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-200",
                i === active
                  ? "ring-2 ring-primary ring-offset-2 scale-95"
                  : "opacity-80 hover:opacity-100 hover:scale-105"
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

      {/* Lightbox Modal */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 focus:outline-none"
            aria-label="Tutup"
          >
            <X className="size-6" />
          </button>

          {/* Main image container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full max-h-[85vh] w-full max-w-5xl items-center justify-center p-4"
          >
            {/* Prev button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev - 1 + photos.length) % photos.length);
                }}
                className="absolute left-4 md:left-6 z-50 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}

            {/* Image display */}
            <div className="relative w-full h-full max-h-[80vh] overflow-hidden rounded-xl animate-in fade-in zoom-in-95 duration-300">
              <Image
                src={photos[active].url}
                alt={photos[active].caption || `${alt} full`}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />
            </div>

            {/* Next button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev + 1) % photos.length);
                }}
                className="absolute right-4 md:right-6 z-50 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Berikutnya"
              >
                <ChevronRight className="size-6" />
              </button>
            )}
          </div>

          {/* Info bar / captions */}
          <div className="absolute bottom-6 left-1/2 z-50 w-full -translate-x-1/2 text-center text-white px-4">
            {photos[active].caption && (
              <p className="text-base font-medium mb-1 drop-shadow-md">
                {photos[active].caption}
              </p>
            )}
            <p className="text-sm text-gray-400 drop-shadow-sm font-light">
              Foto {active + 1} dari {photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

