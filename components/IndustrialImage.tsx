import Image from "next/image";
import type { Img } from "@/lib/images";

/**
 * Industrial/energy photo with a dark navy overlay for premium contrast.
 * - `variant="background"` fills its (relative, sized) parent behind content.
 * - `variant="card"` renders a rounded, self-contained banner.
 */
export default function IndustrialImage({
  img,
  locale,
  variant = "card",
  className = "",
  priority = false,
  overlay = "strong",
}: {
  img: Img;
  locale: string;
  variant?: "background" | "card";
  className?: string;
  priority?: boolean;
  overlay?: "strong" | "soft" | "scrim";
}) {
  const alt = locale === "ar" ? img.alt.ar : img.alt.en;
  // "scrim" keeps the photograph clearly visible: dark only behind the copy
  // (start side), clearing toward the far side — mirrored under RTL.
  const grad =
    overlay === "scrim"
      ? "bg-gradient-to-r rtl:bg-gradient-to-l from-[#04101f]/90 via-[#04101f]/50 to-[#04101f]/10"
      : overlay === "strong"
      ? "bg-gradient-to-b from-[#071a2f]/80 via-[#04101f]/85 to-[#04101f]/95"
      : "bg-gradient-to-b from-[#071a2f]/55 via-[#04101f]/55 to-[#04101f]/80";

  if (variant === "background") {
    return (
      <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden={false}>
        <Image src={img.src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 ${grad}`} />
        {overlay === "scrim" ? (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#04101f]/80 to-transparent" />
        ) : null}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Image
        src={img.src}
        alt={alt}
        width={1920}
        height={1080}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${grad}`} />
    </div>
  );
}
