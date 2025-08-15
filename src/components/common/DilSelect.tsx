// src/components/common/DilSelect.tsx
"use client";
import * as React from "react";
import { useDiller } from "@/hooks/useDiller";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DilItem = {
  dilId: number | string;
  dilAdi: string;
  dilKodu?: string;
};

type Props = {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  /** controlled değer */
  value?: string;
  /** controlled değişim */
  onChange?: (val: string) => void;
  /** değer alanı (varsayılan dilAdi – geriye uyum) */
  valueField?: "dilAdi" | "dilKodu" | "dilId";
  /** etiket alanı (varsayılan dilAdi) */
  labelField?: "dilAdi" | "dilKodu";
  /** seçimi temizleyebilme */
  allowClear?: boolean;
  /** disable */
  disabled?: boolean;
  /** ek sınıflar */
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  "aria-label"?: string;
};

export function DilSelect({
  name = "dil",
  defaultValue,
  placeholder = "Dil seç",
  value: controlledValue,
  onChange,
  valueField = "dilAdi",
  labelField = "dilAdi",
  allowClear = false,
  disabled,
  className,
  triggerClassName,
  contentClassName,
  "aria-label": ariaLabel,
}: Props) {
  const { items, loading, error, refetch } = useDiller() as {
    items: DilItem[];
    loading: boolean;
    error?: string;
    refetch: () => void;
  };

  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const setValue = (v: string) => {
    if (isControlled) onChange?.(v);
    else setUncontrolled(v);
  };

  const getVal = (it: DilItem) => {
    if (valueField === "dilId") return String(it.dilId);
    if (valueField === "dilKodu") return String(it.dilKodu ?? "");
    return String(it.dilAdi);
  };
  const getLabel = (it: DilItem) => {
    if (labelField === "dilKodu") return String(it.dilKodu ?? it.dilAdi);
    return String(it.dilAdi);
  };

  const clear = () => setValue("");

  return (
    <div className={cn("relative", className)}>
      <input type="hidden" name={name} value={value ?? ""} />
      <Select
        value={value}
        onValueChange={setValue}
        disabled={disabled || loading}
      >
        <SelectTrigger
          className={cn("bg-background border-border pr-8", triggerClassName)}
          aria-label={ariaLabel || "Dil seçici"}
        >
          <SelectValue placeholder={loading ? "Yükleniyor…" : placeholder} />
        </SelectTrigger>
        <SelectContent className={cn("bg-popover text-popover-foreground border-border", contentClassName)}>
          {error ? (
            <div className="p-2 text-xs">
              <div className="mb-1 text-destructive">Hata: {error}</div>
              <button
                className="underline"
                onClick={(e) => {
                  e.preventDefault();
                  refetch();
                }}
              >
                Tekrar dene
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="p-2 text-xs text-muted-foreground">Dil bulunamadı</div>
          ) : (
            items.map((d) => (
              <SelectItem key={String(d.dilId)} value={getVal(d)}>
                {getLabel(d)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {allowClear && value && !loading && !disabled && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="Seçimi temizle"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
