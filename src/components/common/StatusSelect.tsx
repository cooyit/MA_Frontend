// src/components/common/StatusSelect.tsx
/** @file Durum filtresi için select bileşeni; STATUS_OPTIONS'tan "all/active/draft/passive" değerlerini döndürür. */

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/status";

/** Formlarda/filtrelerde durum seçimi için sade bir Select. */
export function StatusSelect({
  defaultValue = "all",
  name = "durum",
  className,
  onChange,
}: {
  defaultValue?: string;
  name?: string;
  className?: string;
  onChange?: (v: string) => void;
}) {
  const [val, setVal] = useState(defaultValue);

  return (
    <>
      <Select
        value={val}
        onValueChange={(v) => {
          setVal(v);
          onChange?.(v);
        }}
      >
        <SelectTrigger className={className ?? "bg-background border-border"}>
          <SelectValue placeholder="Seçiniz" />
        </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground border-border">
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* FormData için değer (kontrollü input) */}
      <input type="hidden" name={name} value={val} />
    </>
  );
}
