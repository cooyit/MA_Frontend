// src/components/common/StatusFieldSelect.tsx
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_OPTIONS, StatusNum } from "@/lib/status";

export default function StatusFieldSelect({
  value, onChange, name = "aktif", className,
}: {
  value: StatusNum;
  onChange: (v: StatusNum) => void;
  name?: string;
  className?: string;
}) {
  // filter mode'daki "all" dışındaki 3 seçenek:
  const opts = STATUS_OPTIONS.filter(o => "num" in o) as Array<{ value: string; label: string; num: StatusNum }>;

  return (
    <>
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(Number(v) as StatusNum)}
      >
        <SelectTrigger className={className ?? "bg-background border-border"}>
          <SelectValue placeholder="Durum seç" />
        </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground border-border">
          {opts.map(o => (
            <SelectItem key={o.num} value={String(o.num)}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={String(value)} />
    </>
  );
}
