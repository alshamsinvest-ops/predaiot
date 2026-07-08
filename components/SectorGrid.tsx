import {
  Fuel,
  Zap,
  Building2,
  Leaf,
  Sun,
  Wind,
  BatteryCharging,
  Cable,
  Waypoints,
  Factory,
  Droplets,
  Atom,
  Server,
  Grid3x3,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { SECTORS } from "@/lib/constants";
import CursorSurface from "@/components/kinetic/CursorSurface";
import { RevealGroup, RevealItem } from "@/components/kinetic/Reveal";

const ICONS: Record<string, LucideIcon> = {
  Fuel,
  Zap,
  Building2,
  Leaf,
  Sun,
  Wind,
  BatteryCharging,
  Cable,
  Waypoints,
  Factory,
  Droplets,
  Atom,
  Server,
  Grid3x3,
  Boxes,
};

/**
 * The 15-sector energy value chain, rendered as a premium card grid.
 * `variant="compact"` (homepage band) shows icon + name only;
 * `variant="detail"` (industries page) adds the per-sector description.
 * BESS and Solar carry an "Example" chip — they illustrate the platform,
 * they are not its boundary.
 */
export default function SectorGrid({
  locale,
  variant = "compact",
}: {
  locale: string;
  variant?: "compact" | "detail";
}) {
  const isAr = locale === "ar";
  const detail = variant === "detail";

  return (
    <RevealGroup
      className={
        detail
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      }
      stagger={0.04}
    >
      {SECTORS.map((s) => {
        const Icon = ICONS[s.icon] ?? Boxes;
        const isExample = "example" in s && s.example;
        return (
          <RevealItem key={s.key} className="h-full">
            <CursorSurface
              className={`surface group h-full rounded-2xl ${detail ? "p-5" : "p-4"}`}
            >
              <div className="flex items-center justify-between">
                <Icon
                  className={`text-secondary transition-transform duration-300 group-hover:scale-110 ${
                    detail ? "h-7 w-7" : "h-6 w-6"
                  }`}
                />
                {isExample ? (
                  <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
                    {isAr ? "مثال" : "Example"}
                  </span>
                ) : null}
              </div>
              <h3
                className={`mt-3 font-display font-bold ${
                  detail ? "text-lg" : "text-sm"
                }`}
              >
                {isAr ? s.ar : s.en}
              </h3>
              {detail ? (
                <p className="mt-2 text-sm text-ink-muted">
                  {isAr ? s.detailAr : s.detailEn}
                </p>
              ) : null}
            </CursorSurface>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
