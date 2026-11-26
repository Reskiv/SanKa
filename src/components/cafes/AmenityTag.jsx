import {
  Wifi,
  Plug,
  Moon,
  BookOpen,
  Trees,
  PawPrint,
  Snowflake,
  Clock,
  Croissant,
  Leaf,
  Car,
  Accessibility,
  Dices,
  Droplets,
} from "lucide-react";
import { AMENITY_MAP } from "@/data/cafes";

const ICONS = {
  wifi: Wifi,
  plug: Plug,
  moon: Moon,
  book: BookOpen,
  trees: Trees,
  paw: PawPrint,
  snow: Snowflake,
  clock: Clock,
  croissant: Croissant,
  leaf: Leaf,
  car: Car,
  access: Accessibility,
  dice: Dices,
  droplet: Droplets,
};

export function AmenityTag({ amenity, tone = "light" }) {
  const meta = AMENITY_MAP[amenity];
  if (!meta) return null;
  const Icon = ICONS[meta.icon] || Wifi;
  const styles =
    tone === "dark"
      ? "border-oat/20 bg-oat/[0.07] text-oat/85 hover:bg-oat/[0.14]"
      : "border-cocoa/15 bg-paper text-cocoa/75 hover:border-cocoa/35 hover:text-cocoa";
  return (
    <li className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition-colors duration-300 ${styles}`}>
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
      {meta.label}
    </li>
  );
}

export function AmenityList({ amenities, limit, tone = "light", className = "" }) {
  const shown = limit ? amenities.slice(0, limit) : amenities;
  const rest = limit ? amenities.length - shown.length : 0;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {shown.map((amenity) => (
        <AmenityTag key={amenity} amenity={amenity} tone={tone} />
      ))}
      {rest > 0 && (
        <li
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-semibold ${
            tone === "dark" ? "border-oat/20 text-oat/60" : "border-cocoa/15 text-cocoa/55"
          }`}
        >
          +{rest} more
        </li>
      )}
    </ul>
  );
}