// src/components/common/StatPill.tsx
import clsx from "clsx";
import * as React from "react";

const TONES = {
  neutral: "bg-secondary text-secondary-foreground border border-border/60",
  info: "bg-primary/15 text-primary border border-primary/30",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
  danger: "bg-destructive/15 text-destructive border border-destructive/30",
  muted: "bg-muted text-muted-foreground border border-border/60",
} as const;

export type Tone = keyof typeof TONES;
type Size = "xs" | "sm" | "md"; // sm eklendi

export function StatPill({
  children,
  tone = "neutral",
  size = "md",
  title,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  tone?: Tone;
  size?: Size;
  title?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const toneClass = TONES[tone];
  const sizeClass =
    size === "xs"
      ? "px-1.5 py-0.5 text-[10px]"
      : size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : "px-3 py-1 text-xs";

  return (
    <span
      title={title}
      aria-label={ariaLabel}
      className={clsx(
        "inline-flex items-center rounded-full font-medium shadow-sm",
        "backdrop-blur-[1px]",
        sizeClass,
        toneClass,
        className
      )}
    >
      {children}
    </span>
  );
}
