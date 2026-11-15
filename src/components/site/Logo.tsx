import logoLight from "@/assets/ch-logo-light-bg.png.asset.json";
import logoDark from "@/assets/ch-logo-dark-bg.png.asset.json";
import monoDark from "@/assets/ch-monogram-dark.png.asset.json";
import monoLight from "@/assets/ch-monogram-light.png.asset.json";
import { cn } from "@/lib/utils";

// Source files keep their native proportions: full logo 775x268, monogram 1:1.
const LOGO_RATIO = 775 / 268;

export function Logo({
  variant = "onLight",
  height = 40,
  className,
}: {
  variant?: "onLight" | "onDark";
  height?: number;
  className?: string;
}) {
  const src = variant === "onLight" ? logoLight.url : logoDark.url;
  return (
    <img
      src={src}
      alt="CH Business Services"
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      className={cn("block h-auto select-none", className)}
      style={{ height, width: Math.round(height * LOGO_RATIO) }}
      decoding="async"
    />
  );
}

export function Monogram({
  variant = "onLight",
  size = 40,
  className,
  alt = "",
}: {
  variant?: "onLight" | "onDark";
  size?: number;
  className?: string;
  alt?: string;
}) {
  // onLight shows the dark circle; onDark shows the light circle.
  const src = variant === "onLight" ? monoDark.url : monoLight.url;
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("block select-none", className)}
      decoding="async"
      loading="lazy"
    />
  );
}
