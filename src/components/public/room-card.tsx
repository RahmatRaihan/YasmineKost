import Link from "next/link";
import Image from "next/image";
import { BedDouble, Snowflake, ShowerHead, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoomStatusBadge } from "@/components/status-badge";
import { ROOM_CATEGORY_LABEL } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export type RoomCardData = {
  id: string;
  number: string;
  name: string | null;
  category: string;
  monthlyPrice: number;
  status: string;
  privateBath: boolean;
  hasAC: boolean;
  photo: string | null;
};

export function RoomCard({ room }: { room: RoomCardData }) {
  return (
    <Link
      href={`/kamar/${room.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {room.photo ? (
          <Image
            src={room.photo}
            alt={room.name || `Kamar ${room.number}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-10" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <RoomStatusBadge status={room.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-semibold">
            {room.name || `Kamar ${room.number}`}
          </h3>
          <Badge variant="outline">{ROOM_CATEGORY_LABEL[room.category]}</Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="size-3.5" /> Kamar {room.number}
          </span>
          {room.hasAC && (
            <span className="flex items-center gap-1">
              <Snowflake className="size-3.5" /> AC
            </span>
          )}
          <span className="flex items-center gap-1">
            <ShowerHead className="size-3.5" />
            {room.privateBath ? "KM Dalam" : "KM Luar"}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="font-display text-lg font-bold text-primary">
              {formatRupiah(room.monthlyPrice)}
            </span>
            <span className="text-xs text-muted-foreground"> /bulan</span>
          </div>
          <span className="text-sm font-medium text-primary group-hover:underline">
            Lihat detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
