// src/components/common/MultiSelectChips.tsx
"use client";
import * as React from "react";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { fuzzy } from "@/lib/fuzzy";

type Item = { value: string; label: string };

type Props = {
  items: Item[];
  value: string[];                        // seçili value listesi
  onChange: (v: string[]) => void;
  placeholder?: string;
  allLabel?: string;                      // "Tümünü Seç"
  className?: string;
  /** Filtreye göre toplu seçim davranışı */
  selectAllScope?: "all" | "filtered";
  /** Popover içeriği sınıfı */
  contentClassName?: string;
  /** Dikey max yükseklik (px) */
  maxHeight?: number;
  /** Arama açıldığında focus */
  autoFocusSearch?: boolean;
  /** Her seçimde popover’ı kapat */
  closeOnPick?: boolean;
  /** Devre dışı */
  disabled?: boolean;
  /** Dışarıya açık onOpenChange */
  onOpenChange?: (open: boolean) => void;
};

export function MultiSelectChips({
  items, value, onChange,
  placeholder = "Seç",
  allLabel = "Tümünü Seç",
  className,
  selectAllScope = "all",
  contentClassName,
  maxHeight = 256,
  autoFocusSearch = true,
  closeOnPick = false,
  disabled,
  onOpenChange,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open && autoFocusSearch) {
      // küçük timeout ile render sonrası odak
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open, autoFocusSearch]);

  const pool = React.useMemo(() => items.map(i => i.label), [items]);

  const filtered = React.useMemo(() => {
    const cand = q ? fuzzy(q, pool, 30).map(x => x.text) : pool;
    return items.filter(i => cand.includes(i.label));
  }, [q, items, pool]);

  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
    onChange(next);
    if (closeOnPick) setOpen(false);
  };

  const selectAll = () => {
    const src = selectAllScope === "filtered" ? filtered : items;
    onChange(src.map(i => i.value));
  };

  const clearAll  = () => onChange([]);

  const chips = items.filter(i => value.includes(i.value));

  return (
    <div className={cn("w-full", className)}>
      {chips.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2" role="list" aria-label="Seçili öğeler">
          {chips.map(ch => (
            <span
              key={ch.value}
              role="listitem"
              className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2 py-1 text-xs"
              title={ch.label}
            >
              <span className="truncate max-w-[220px]">{ch.label}</span>
              <button
                type="button"
                className="opacity-70 hover:opacity-100"
                onClick={() => toggle(ch.value)}
                aria-label={`${ch.label} öğesini kaldır`}
                title="Kaldır"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Popover
        open={open}
        onOpenChange={(o) => { setOpen(o); onOpenChange?.(o); }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between"
            aria-haspopup="listbox"
            aria-expanded={open}
            disabled={disabled}
          >
            <span className={cn(!chips.length && "text-muted-foreground")}>
              {chips.length ? `${placeholder}: ${chips.length}` : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn("w-[var(--radix-popover-trigger-width)] p-2", contentClassName)}
          align="start"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="relative grow">
              <Input
                ref={inputRef}
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Ara..."
                aria-label="Öğe ara"
                className="pr-7"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Aramayı temizle"
                  title="Aramayı temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Tümünü seç */}
            <Button type="button" variant="ghost" size="sm" onClick={selectAll} title={allLabel}>
              <Plus className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">{allLabel}</span>
              <span className="sr-only">{allLabel}</span>
            </Button>

            {/* Temizle */}
            <Button type="button" variant="ghost" size="sm" onClick={clearAll} title="Temizle">
              <X className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Temizle</span>
              <span className="sr-only">Temizle</span>
            </Button>
          </div>

          <ScrollArea className="max-h-64 pr-2" style={{ maxHeight }}>
            <div role="listbox" aria-multiselectable>
              {filtered.map(i => {
                const active = value.includes(i.value);
                return (
                  <button
                    key={i.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={()=>toggle(i.value)}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5",
                      "flex items-center justify-between",
                      "hover:bg-accent",
                      active && "bg-accent"
                    )}
                    title={i.label}
                  >
                    <span className="text-sm">{i.label}</span>
                    {active && <Check className="h-4 w-4" aria-hidden="true" />}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">Sonuç yok</div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-2 flex gap-2">
            <Button type="button" className="w-full" onClick={()=>setOpen(false)}>Tamam</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
