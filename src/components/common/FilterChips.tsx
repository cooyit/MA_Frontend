"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Chip = {
  id: string;            // benzersiz
  label: string;         // gösterilecek metin
  onRemove: () => void;  // kaldırma handler
};

type Props = {
  chips: Chip[];
  onClearAll?: () => void;                 // yeni: hepsini temizle
  variant?: "pill" | "button";             // yeni: görsel davranış
  className?: string;
};

export function FilterChips({
  chips,
  onClearAll,
  variant = "pill",
  className = "",
}: Props) {
  if (!chips.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 mt-2 ${className}`}>
      {chips.map((c) =>
        variant === "button" ? (
          <button
            key={c.id}
            onClick={c.onRemove}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-1 text-xs hover:bg-muted/80"
            title="Kaldır"
            aria-label={`Kaldır: ${c.label}`}
          >
            {c.label}
            <X className="h-3 w-3" />
          </button>
        ) : (
          <span
            key={c.id}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs"
          >
            {c.label}
            <Button
              size="icon"
              variant="ghost"
              className="h-4 w-4 p-0"
              onMouseDown={(e)=>e.preventDefault()}   // focus kalır
              onClick={c.onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </span>
        )
      )}

      {onClearAll && (
        <Button size="sm" variant="ghost" onClick={onClearAll} className="ml-1">
          Hepsini temizle
        </Button>
      )}
    </div>
  );
}
