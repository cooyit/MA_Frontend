// src/components/common/DurumSelect.tsx
/** @file Durum filtresi için select bileşeni; STATUS_OPTIONS'tan "all/active/draft/passive" değerlerini döndürür. */
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/status";
import type { StatusNum } from "@/lib/status"; // num alanı için tip
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = Readonly<{
  value: string;
  label: string;
  num?: StatusNum;
}>;

// STATUS_OPTIONS genelde `as const` olduğu için readonly uyumu koruyoruz.
const DEFAULT_STATUS_OPTIONS = STATUS_OPTIONS as ReadonlyArray<Option>;

export function DurumSelect({
  defaultValue = "all",
  value: controlledValue,
  onChange,
  name = "durum",
  className,
  triggerClassName,
  contentClassName,
  options = DEFAULT_STATUS_OPTIONS, // <-- readonly default
  allowClear = false,
  disabled,
  "aria-label": ariaLabel,
}: {
  defaultValue?: string;
  /** controlled kullanım için */
  value?: string;
  onChange?: (v: string) => void;
  name?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  options?: ReadonlyArray<Option>; // <-- readonly dizi
  allowClear?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const isControlled = controlledValue !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const value = isControlled ? (controlledValue as string) : inner;

  const setValue = (v: string) => {
    if (isControlled) onChange?.(v);
    else {
      setInner(v);
      onChange?.(v);
    }
  };

  // Not: Clear yaptığımızda "" veriyoruz; istersen "all" gönderecek şekilde değiştirebilirsin.
  const clear = () => setValue("");

  return (
    <div className={cn("relative", className)}>
      <input type="hidden" name={name} value={value ?? ""} />
      <Select value={value} onValueChange={setValue} disabled={disabled}>
        <SelectTrigger
          className={cn("bg-background border-border pr-8", triggerClassName)}
          aria-label={ariaLabel || "Durum seçici"}
        >
          <SelectValue placeholder="Seçiniz" />
        </SelectTrigger>
        <SelectContent className={cn("bg-popover text-popover-foreground border-border", contentClassName)}>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {allowClear && value && !disabled && (
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
