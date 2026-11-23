import { cn } from "@/lib/utils";

// Logo files are served as static files from /public so they load on any host.
//   ch-logo-light.png     – charcoal artwork for light backgrounds
//   ch-logo-dark.png      – cream artwork for dark backgrounds
//   ch-monogram.png       – charcoal circle for light backgrounds
//   ch-monogram-light.png – cream circle for dark backgrounds
const LOGO_SRC = { onLight: "/ch-logo-light.png", onDark: "/ch-logo-dark.png" } as const;
const MONOGRAM_SRC = { onLight: "/ch-monogram.png", onDark: "/ch-monogram-light.png" } as const;

// Source files keep their native proportions: full logo 1200x394, monogram 1:1.
const LOGO_RATIO = 1200 / 394;

export function Logo({
  variant = "onLight",
  height = 40,
  className,
}: {
  variant?: "onLight" | "onDark";
  height?: number;
  className?: string;
}) {
  const src = LOGO_SRC[variant];
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
  const src = MONOGRAM_SRC[variant];
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
