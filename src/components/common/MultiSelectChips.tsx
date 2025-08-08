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
};

export function MultiSelectChips({
  items, value, onChange,
  placeholder = "Seç",
  allLabel = "Tümünü Seç",
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const pool = React.useMemo(() => items.map(i => i.label), [items]);
  const filtered = React.useMemo(() => {
    const cand = q ? fuzzy(q, pool, 30).map(x => x.text) : pool;
    return items.filter(i => cand.includes(i.label));
  }, [q, items, pool]);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);

  const selectAll = () => onChange(items.map(i => i.value));
  const clearAll  = () => onChange([]);

  const chips = items.filter(i => value.includes(i.value));

  return (
    <div className={cn("w-full", className)}>
      {chips.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {chips.map(ch => (
            <span key={ch.value}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-muted border border-border">
              {ch.label}
              <button className="opacity-70 hover:opacity-100" onClick={() => toggle(ch.value)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className={cn(!chips.length && "text-muted-foreground")}>
              {chips.length ? `${placeholder}: ${chips.length}` : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
          <div className="flex items-center gap-2 mb-2">
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ara..." />

            {/* Tümünü seç */}
            <Button variant="ghost" size="sm" onClick={selectAll} title={allLabel}>
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{allLabel}</span>
              <span className="sr-only">{allLabel}</span>
            </Button>

            {/* Temizle */}
            <Button variant="ghost" size="sm" onClick={clearAll} title="Temizle">
              <X className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Temizle</span>
              <span className="sr-only">Temizle</span>
            </Button>
          </div>

          <ScrollArea className="max-h-64 pr-2">
            {filtered.map(i => {
              const active = value.includes(i.value);
              return (
                <button key={i.value}
                  onClick={()=>toggle(i.value)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent",
                    active && "bg-accent"
                  )}>
                  <span className="text-sm">{i.label}</span>
                  {active && <Check className="h-4 w-4" />}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-xs text-muted-foreground px-2 py-1.5">Sonuç yok</div>
            )}
          </ScrollArea>

          <div className="mt-2 flex gap-2">
            <Button className="w-full" onClick={()=>setOpen(false)}>Tamam</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}