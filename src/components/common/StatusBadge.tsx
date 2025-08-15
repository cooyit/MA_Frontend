// src/components/common/StatusBadge.tsx
/** @file Küçük durum rozetleri; 0/1/2 (Pasif/Aktif/Taslak) veya "online/offline/error" gibi sistem durumlarını görselleştirir. */

import clsx from "clsx";
import { StatPill, type Tone } from "./StatPill";
import { toStatusNumber, statusLabel } from "@/lib/status";

type SystemStatus = "online" | "offline" | "error";
type StatusValue = number | SystemStatus | unknown;

export function StatusBadge({
  value,
  className,
  size = "xs",
  showDot = false,
  labelOverride,
  title,
  "aria-label": ariaLabel,
}: {
  value: StatusValue;
  className?: string;
  size?: "xs" | "sm" | "md";
  /** Sol tarafta renkli bir nokta göster */
  showDot?: boolean;
  /** Etiketi zorla/override et */
  labelOverride?: string;
  title?: string;
  "aria-label"?: string;
}) {
  let tone: Tone = "muted";
  let label: string;

  if (typeof value === "number" || value === 0 || value === 1 || value === 2) {
    const n = toStatusNumber(value);
    label = statusLabel(n);
    tone = n === 1 ? "success" : n === 2 ? "warning" : "danger";
  } else {
    const s = String(value ?? "").toLowerCase();
    if (s === "online") {
      tone = "success";
      label = "Online";
    } else if (s === "offline") {
      tone = "danger";
      label = "Offline";
    } else if (s === "error") {
      tone = "warning";
      label = "Hata";
    } else if (s) {
      // bilinmeyen string: olduğu gibi yaz
      tone = "muted";
      label = String(value);
    } else {
      tone = "muted";
      label = "—";
    }
  }

  const content = (
    <>
      {showDot && (
        <span
          aria-hidden="true"
          className={clsx(
            "mr-1 h-1.5 w-1.5 shrink-0 rounded-full",
            // dot rengi: currentColor ile görünür; ek sınıfa gerek yok
            "bg-current"
          )}
        />
      )}
      <span className="truncate">{labelOverride ?? label}</span>
    </>
  );

  return (
    <StatPill
      tone={tone}
      size={size}
      className={className}
      title={title ?? (labelOverride ?? label)}
      aria-label={ariaLabel ?? (labelOverride ?? label)}
    >
      {content}
    </StatPill>
  );
}
