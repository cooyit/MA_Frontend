// src/components/eslesme/SmartTextSearch.tsx
"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { fuzzy, norm } from "@/lib/fuzzy";
import { cn } from "@/lib/utils";
import { Search, CornerDownLeft } from "lucide-react";


type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hints?: string[];
  minChars?: number;
  maxItems?: number;        // yeni: liste sınırı
  className?: string;
  onPick?: (v: string) => void;
};

export function SmartTextSearch({
  value,
  onChange,
  placeholder,
  hints = [],
  minChars = 1,
  maxItems = 30,
  className,
  onPick,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<number>(-1); // klavye odak
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Öneriler (TR duyarlı fuzzy); exact eşleşmeyi üste taşı
  const list = React.useMemo(() => {
    const q = value.trim();
    if (q.length < minChars) return [];
    const base = fuzzy(q, hints, maxItems).map((x) => x.text);
    const qi = q; 
    const exactIdx = base.findIndex((t) => norm(t) === norm(qi));

    if (exactIdx > 0) {
      const hit = base[exactIdx];
      base.splice(exactIdx, 1);
      base.unshift(hit);
    }
    return base;
  }, [value, hints, minChars, maxItems]);

  // Dropdown’a tıklarken blur olmasın
  const preventBlur: React.MouseEventHandler = (e) => e.preventDefault();

  const keepFocus = React.useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const handlePick = (v: string) => {
    onPick?.(v);
    onChange("");
    setActive(-1);
    keepFocus();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(list.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      // aktif öğe varsa onu, yoksa yazanı gönder
      if (active >= 0 && list[active]) {
        e.preventDefault();
        handlePick(list[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* solda arama ikonu */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      {/* sağda '↵ Ekle' görsel ipucu (sadece dekoratif; işlev Enter’da) */}
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
        <CornerDownLeft className="h-3 w-3" />
        <span className="hidden md:inline">Ekle</span>
      </div>

      <Input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        spellCheck={false}
        className="pl-9 pr-10"
      />

      {open && list.length > 0 && (
        <Card
          className="absolute z-30 mt-1 w-full p-1 max-h-64 overflow-auto"
          tabIndex={-1}
          onMouseDown={preventBlur}
          onPointerDown={preventBlur}
        >
          {list.map((item, idx) => (
            <button
              key={item}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded outline-none",
                idx === active ? "bg-accent" : "hover:bg-accent"
              )}
              onMouseEnter={() => setActive(idx)}
              onClick={() => handlePick(item)}
            >
              {item}
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
