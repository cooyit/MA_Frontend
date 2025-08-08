"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const DURUMLAR = [
  { v: 1, label: "Aktif" },
  { v: 0, label: "Pasif" },
  { v: 2, label: "Taslak" },
] as const;
export type Durum = typeof DURUMLAR[number]["v"]; // <-- export ekle


export function DurumMultiSelect({
  value,
  onChange,
  placeholder = "Durum seç",
  closeOnPick = false,              // yeni: seçimde popover kapansın mı?
  showSelectAll = true,             // yeni: Hepsini Seç / Temizle aksiyonları
  order: orderProp = "defined",     // "defined" | "logical" | "asc"
}: {
  value: Durum[];
  onChange: (next: Durum[]) => void;
  placeholder?: string;
  closeOnPick?: boolean;
  showSelectAll?: boolean;
  order?: "defined" | "logical" | "asc";
}) {
  const [open, setOpen] = React.useState(false);

  const options = React.useMemo(() => {
    if (orderProp === "asc") {
      return [...DURUMLAR].sort((a, b) => a.label.localeCompare(b.label, "tr"));
    }
    if (orderProp === "logical") {
      // Mantıksal sıralama örn: Aktif (1) → Taslak (2) → Pasif (0)
      const order = new Map<Durum, number>([
        [1, 0],
        [2, 1],
        [0, 2],
      ]);
      return [...DURUMLAR].sort((a, b) => (order.get(a.v)! - order.get(b.v)!));
    }
    return DURUMLAR; // default: tanımlandığı gibi
  }, [orderProp]);

  const toggle = (v: Durum, checked: boolean | "indeterminate") => {
    const on = checked === "indeterminate" ? true : !!checked;
    onChange(on ? Array.from(new Set([...value, v])) : value.filter((x) => x !== v));
    if (closeOnPick) setOpen(false);
  };

  const label = value.length
    ? options
        .filter((opt) => value.includes(opt.v))
        .map((opt) => opt.label)
        .join(", ")
    : placeholder;

  const selectAll = () => onChange(options.map((o) => o.v));
  const clearAll = () => onChange([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-between">
          {label}
          <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[260px] p-2">
        <div className="flex flex-col gap-2">
          {options.map((d) => {
            const checked = value.includes(d.v);
            return (
              <label key={d.v} className="flex items-center gap-2 cursor-pointer">
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
