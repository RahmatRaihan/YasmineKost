import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  BOOKING_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  ROOM_STATUS_LABEL,
} from "@/lib/constants";

type Variant = NonNullable<BadgeProps["variant"]>;

const ROOM_VARIANT: Record<string, Variant> = {
  AVAILABLE: "success",
  OCCUPIED: "muted",
  MAINTENANCE: "warning",
};

const BOOKING_VARIANT: Record<string, Variant> = {
  PENDING: "warning",
  APPROVED: "default",
  REJECTED: "danger",
  CANCELLED: "muted",
  CONVERTED: "success",
};

const PAYMENT_VARIANT: Record<string, Variant> = {
  UNPAID: "muted",
  PENDING_VERIFICATION: "warning",
  PAID: "success",
  OVERDUE: "danger",
};

export function RoomStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={ROOM_VARIANT[status] ?? "muted"}>
      {ROOM_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

export function BookingStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={BOOKING_VARIANT[status] ?? "muted"}>
      {BOOKING_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={PAYMENT_VARIANT[status] ?? "muted"}>
      {PAYMENT_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
