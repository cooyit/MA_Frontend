// src/components/common/DilMultiSelect.tsx
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, X } from "lucide-react";
import { useDiller } from "@/hooks/useDiller";
import { cn } from "@/lib/utils";

type SelectAllScope = "all" | "filtered";

type DilItem = {
  dilId: number | string;
  dilAdi: string;
  dilKodu?: string;
};

export function DilMultiSelect({
  value,
  onChange,
  placeholder = "Dil seç",
  closeOnPick = false,
  selectAllScope = "all",
  /** değer olarak hangi alan kullanılacak? geriye uyumluluk için varsayılan: dilAdi */
  valueField = "dilAdi",
  /** buton ve içerik için ek sınıflar */
  buttonClassName,
  contentClassName,
  /** popover kapanınca arama kutusunu temizle */
  clearQueryOnClose = true,
  /** liste yüksekliği (px) */
  listHeight = 240,
  disabled,
}: {
  value: string[]; // Seçili değerler (valueField'e göre)
  onChange: (next: string[]) => void;
  placeholder?: string;
  closeOnPick?: boolean;
  selectAllScope?: SelectAllScope;
  valueField?: "dilAdi" | "dilKodu" | "dilId";
  buttonClassName?: string;
  contentClassName?: string;
  clearQueryOnClose?: boolean;
  listHeight?: number;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const { items, loading, error, refetch } = useDiller() as {
    items: DilItem[];
    loading: boolean;
    error?: string;
    refetch: () => void;
  };

  React.useEffect(() => {
    if (!open && clearQueryOnClose) setQ("");
  }, [open, clearQueryOnClose]);

  const getVal = React.useCallback(
    (it: DilItem) => {
      if (valueField === "dilId") return String(it.dilId);
      if (valueField === "dilKodu") return String(it.dilKodu ?? "");
      return String(it.dilAdi);
    },
    [valueField]
  );

  const getLabel = (it: DilItem) => it.dilAdi;

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => getLabel(it).toLowerCase().includes(term));
  }, [items, q]);

  const toggle = (optionVal: string, checked: boolean | "indeterminate") => {
    const on = checked === "indeterminate" ? true : !!checked;
    onChange(on ? Array.from(new Set([...value, optionVal])) : value.filter((x) => x !== optionVal));
    if (closeOnPick) setOpen(false);
  };

  const selectAll = () => {
    const pool = selectAllScope === "filtered" ? filtered : items;
    onChange(pool.map((it) => getVal(it)).filter((v) => v));
  };
  const clearAll = () => onChange([]);

  const label =
    value.length === 0
      ? placeholder
      : value.length === 1
      ? // değeri etikete çevir
        (() => {
          const first = value[0];
          const match = items.find((it) => getVal(it) === first);
          return match ? getLabel(match) : first;
        })()
      : (() => {
          const first = value[0];
          const match = items.find((it) => getVal(it) === first);
          const firstLabel = match ? getLabel(match) : first;
          return `${firstLabel} +${value.length - 1}`;
        })();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between bg-background border-border",
            disabled && "opacity-60 cursor-not-allowed",
            buttonClassName
          )}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-60" aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn("w-[300px] p-2 bg-popover text-popover-foreground border-border", contentClassName)}
      >
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Input
              placeholder="Ara..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-8 pr-7"
              aria-label="Dil ara"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {loading && <div className="px-1 text-xs text-muted-foreground">Yükleniyor…</div>}

          {error && (
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-destructive">Hata: {error}</div>
              <Button size="sm" variant="outline" onClick={refetch}>
                Tekrar dene
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filtered.length === 0 ? (
                <div className="px-1 text-xs text-muted-foreground">Sonuç yok</div>
              ) : (
                <ScrollArea style={{ maxHeight: listHeight }}>
                  <div className="flex flex-col gap-1 pr-1">
                    {filtered.map((it) => {
                      const optionVal = getVal(it);
                      const checked = value.includes(optionVal);
                      return (
                        <label
                          key={String(it.dilId)}
                          className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-accent"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => toggle(optionVal, v)}
                            className="h-4 w-4"
                            aria-label={getLabel(it)}
                          />
                          <span className="text-sm">{getLabel(it)}</span>
                        </label>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </>
          )}

          {(filtered.length > 0 || value.length > 0) && (
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Hepsini Seç
              </Button>
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
