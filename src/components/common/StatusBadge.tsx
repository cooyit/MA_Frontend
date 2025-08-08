// src/components/common/StatusBadge.tsx
/** @file Küçük durum rozetleri; 0/1/2 (Pasif/Aktif/Taslak) veya "online/offline/error" gibi sistem durumlarını görselleştirir. */

import clsx from "clsx";

type StatusValue = 0 | 1 | 2 | "online" | "offline" | "error";

/** Verilen duruma göre renk/tone seçip rozet basar. */
export function StatusBadge({
  value,
  className
}: {
  value: StatusValue;
  className?: string;
}) {
  let label: string;
  let tone: string;

  if (typeof value === "number") {
    // Model / Boyut / Kriter / Gösterge durumları
    label = value === 1 ? "Aktif" : value === 2 ? "Taslak" : "Pasif";
    tone =
      value === 1
        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
        : value === 2
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
        : "bg-destructive/15 text-destructive border border-destructive/30";
  } else {
    // API & DB gibi sistem durumları
    switch (value) {
      case "online":
        label = "Online";
        tone =
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30";
        break;
      case "offline":
        label = "Offline";
        tone =
          "bg-destructive/15 text-destructive border border-destructive/30";
        break;
      case "error":
        label = "Hata";
        tone =
          "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30";
        break;
      default:
        label = String(value);
        tone = "bg-muted text-muted-foreground";
    }
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        "shadow-sm",
        tone,
        className
      )}
    >
      {label}
    </span>
  );
}
