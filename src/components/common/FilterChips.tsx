//src/components/common/FilterChips.tsx
"use client";

import * as React from "react";
import { X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Chip = {
  id: string;            // benzersiz
  label: string;         // gösterilecek metin
  onRemove: () => void;  // kaldırma handler
  title?: string;        // (opsiyonel) tooltip
};

type Props = {
  chips: Chip[];
  onClearAll?: () => void;
  variant?: "pill" | "button";
  className?: string;
  /** Çok sayıda chip olduğunda ilk N tanesini göster, kalanını “+N” olarak grupla */
  maxVisible?: number;
  /** “+N” butonunun metinleri */
  moreLabel?: (hiddenCount: number) => string;
  lessLabel?: string;
  /** Hepsini temizle için aria-label */
  clearAllAriaLabel?: string;
  /** Chip kaldırma klavye desteği (Enter/Backspace) */
  enableKeyboardRemove?: boolean;
};

export function FilterChips({
  chips,
  onClearAll,
  variant = "pill",
  className,
  maxVisible,
  moreLabel = (n) => `+${n}`,
  lessLabel = "Daha az",
  clearAllAriaLabel = "Tüm filtreleri temizle",
  enableKeyboardRemove = true,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);
  if (!chips.length) return null;

  const visibleCount =
    expanded || !maxVisible ? chips.length : Math.min(chips.length, maxVisible);

  const visible = chips.slice(0, visibleCount);
  const hiddenCount = Math.max(0, chips.length - visibleCount);

  return (
    <div
      className={cn("mt-2 flex flex-wrap items-center gap-2", className)}
      role="list"
      aria-label="Etkin filtreler"
    >
      {visible.map((c) =>
        variant === "button" ? (
          <button
            key={c.id}
            type="button" // önemli: form submit'i engelle
            onClick={c.onRemove}
            onKeyDown={(e) => {
              if (!enableKeyboardRemove) return;
              if (e.key === "Enter" || e.key === "Backspace") {
                e.preventDefault();
                c.onRemove();
              }
            }}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-1 text-xs hover:bg-muted/80"
            title={c.title ?? "Kaldır"}
            aria-label={`Kaldır: ${c.label}`}
            role="listitem"
          >
            <span className="truncate max-w-[200px]">{c.label}</span>
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        ) : (
          <span
            key={c.id}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs"
            role="listitem"
            title={c.title}
          >
            <span className="truncate max-w-[220px]">{c.label}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-4 w-4 p-0"
              onMouseDown={(e) => e.preventDefault()} // focus kalır
              onClick={c.onRemove}
              aria-label={`Kaldır: ${c.label}`}
              title="Kaldır"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </Button>
          </span>
        )
      )}

      {hiddenCount > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((s) => !s)}
          className="h-7 px-2"
          aria-expanded={expanded}
          aria-label={expanded ? lessLabel : moreLabel(hiddenCount)}
          title={expanded ? lessLabel : moreLabel(hiddenCount)}
        >
          <MoreHorizontal className="mr-1 h-4 w-4" aria-hidden="true" />
          {expanded ? lessLabel : moreLabel(hiddenCount)}
        </Button>
      )}

      {onClearAll && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClearAll}
          className="ml-1"
          aria-label={clearAllAriaLabel}
          title={clearAllAriaLabel}
        >
          Hepsini temizle
        </Button>
      )}
    </div>
  );
}
