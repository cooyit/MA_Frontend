// src/components/common/DilMultiSelect.tsx
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useDiller } from "@/hooks/useDiller";

type SelectAllScope = "all" | "filtered";

export function DilMultiSelect({
  value,
  onChange,
  placeholder = "Dil seç",
  closeOnPick = false,              // DurumMultiSelect ile aynı
  selectAllScope = "all",           // "all" -> tüm diller, "filtered" -> sadece görünenler
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  closeOnPick?: boolean;
  selectAllScope?: SelectAllScope;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const { items, loading, error, refetch } = useDiller();

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => it.dilAdi.toLowerCase().includes(term));
  }, [items, q]);

  const toggle = (dilAdi: string, checked: boolean | "indeterminate") => {
    const on = checked === "indeterminate" ? true : !!checked;
    onChange(on ? Array.from(new Set([...value, dilAdi])) : value.filter((x) => x !== dilAdi));
    if (closeOnPick) setOpen(false);
  };

  const selectAll = () => {
    const pool = selectAllScope === "filtered" ? filtered : items;
    onChange(pool.map((it) => it.dilAdi));
  };
  const clearAll = () => onChange([]);

  const label =
    value.length === 0
      ? placeholder
      : value.length === 1
      ? value[0]
      : `${value[0]} +${value.length - 1}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-between">
          {label}
          <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[300px] p-2">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Ara..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-8"
          />

          {loading && <div className="text-xs text-muted-foreground px-1">Yükleniyor…</div>}

          {error && (
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-destructive">Hata: {error}</div>
              <Button size="sm" variant="outline" onClick={refetch}>Tekrar dene</Button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-xs text-muted-foreground px-1">Sonuç yok</div>
          )}

          {!loading && !error &&
            filtered.map((it) => {
              const checked = value.includes(it.dilAdi);
              return (
                <label key={it.dilId} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => toggle(it.dilAdi, v)}
                    className="h-4 w-4"
                    aria-label={it.dilAdi}
                  />
                  <span className="text-sm">{it.dilAdi}</span>
                </label>
              );
            })}

          {(filtered.length > 0 || value.length > 0) && (
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={selectAll}>Hepsini Seç</Button>
              {value.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>Temizle</Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
