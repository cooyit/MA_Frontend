//src/components/common/DurumMultiSelect.tsx
"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const DURUMLAR = [
  { v: 1 as const, label: "Aktif" },
  { v: 0 as const, label: "Pasif" },
  { v: 2 as const, label: "Taslak" },
] as const;
export type Durum = (typeof DURUMLAR)[number]["v"];

export function durumLabel(v: Durum) {
  return DURUMLAR.find((d) => d.v === v)?.label ?? String(v);
}

export function DurumMultiSelect({
  value,
  onChange,
  placeholder = "Durum seç",
  closeOnPick = false,
  showSelectAll = true,
  order: orderProp = "defined",
  /** ekstra opsiyonlar */
  disabled,
  buttonClassName,
  contentClassName,
  /** birden çok seçimde etiketleri kısalt: "Aktif +1" */
  compactLabel = false,
  "aria-label": ariaLabel,
}: {
  value: Durum[];
  onChange: (next: Durum[]) => void;
  placeholder?: string;
  closeOnPick?: boolean;
  showSelectAll?: boolean;
  order?: "defined" | "logical" | "asc";
  disabled?: boolean;
  buttonClassName?: string;
  contentClassName?: string;
  compactLabel?: boolean;
  "aria-label"?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const options = React.useMemo(() => {
    if (orderProp === "asc") {
      return [...DURUMLAR].sort((a, b) => a.label.localeCompare(b.label, "tr"));
    }
    if (orderProp === "logical") {
      // Mantıksal sıralama: Aktif(1) → Taslak(2) → Pasif(0)
      const order = new Map<Durum, number>([
        [1, 0],
        [2, 1],
        [0, 2],
      ]);
      return [...DURUMLAR].sort((a, b) => (order.get(a.v)! - order.get(b.v)!));
    }
    return DURUMLAR;
  }, [orderProp]);

  const toggle = (v: Durum, checked: boolean | "indeterminate") => {
    const on = checked === "indeterminate" ? true : !!checked;
    onChange(on ? Array.from(new Set([...value, v])) : value.filter((x) => x !== v));
    if (closeOnPick) setOpen(false);
  };

  const selectAll = () => onChange(options.map((o) => o.v));
  const clearAll = () => onChange([]);

  const selectedOpts = options.filter((opt) => value.includes(opt.v));
  const label =
    value.length === 0
      ? placeholder
      : compactLabel && value.length > 1
      ? `${durumLabel(selectedOpts[0].v)} +${value.length - 1}`
      : selectedOpts.map((o) => o.label).join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between bg-background border-border", buttonClassName)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel || "Durum çoklu seçici"}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-60" aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn("w-[260px] p-2 bg-popover text-popover-foreground border-border", contentClassName)}
      >
        <div role="listbox" aria-multiselectable className="flex flex-col gap-2">
          {options.map((d) => {
            const checked = value.includes(d.v);
            return (
              <label
                key={d.v}
                role="option"
                aria-selected={checked}
                className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-accent"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => toggle(d.v, v)}
                  className="h-4 w-4"
                  aria-label={d.label}
                />
                <span className="text-sm">{d.label}</span>
              </label>
            );
          })}

          {(showSelectAll || value.length > 0) && (
            <div className="flex justify-end gap-2 pt-1">
              {showSelectAll && (
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Hepsini Seç
                </Button>
              )}
              {value.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Temizle
                </Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
