// src/components/common/DilSelect.tsx
"use client";
import * as React from "react";
import { useDiller } from "@/hooks/useDiller";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  value?: string;                       // controlled destek
  onChange?: (val: string) => void;     // controlled destek
};

export function DilSelect({
  name = "dilAdi",
  defaultValue,
  placeholder = "Dil seç",
  value: controlledValue,
  onChange,
}: Props) {
  const { items, loading, error, refetch } = useDiller();

  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const setValue = (v: string) => {
    if (isControlled) onChange?.(v);
    else setUncontrolled(v);
  };

  return (
    <>
      <input type="hidden" name={name} value={value ?? ""} />
      <Select value={value} onValueChange={setValue} disabled={loading}>
        <SelectTrigger className="bg-background border-border">
          <SelectValue placeholder={loading ? "Yükleniyor…" : placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground border-border">
          {error ? (
            <div className="p-2 text-xs">
              <div className="text-destructive mb-1">Hata: {error}</div>
              <button className="underline" onClick={(e) => { e.preventDefault(); refetch(); }}>
                Tekrar dene
              </button>
            </div>
          ) : (
            items.map((d) => (
              <SelectItem key={d.dilId} value={d.dilAdi}>
                {d.dilAdi}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </>
  );
}
