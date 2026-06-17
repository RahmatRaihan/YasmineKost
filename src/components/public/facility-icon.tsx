import {
  Wifi,
  CookingPot,
  Bike,
  Shirt,
  ShieldCheck,
  Sofa,
  Droplets,
  Zap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  "cooking-pot": CookingPot,
  bike: Bike,
  shirt: Shirt,
  "shield-check": ShieldCheck,
  sofa: Sofa,
  droplets: Droplets,
  zap: Zap,
};

export function FacilityIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICON_MAP[name]) || Sparkles;
  return <Icon className={className} />;
}
