// components/common/SearchFilterInput.tsx

/**
 * SearchFilterInput - Ortak filtre arama input bileşeni
 *
 * Açıklama:
 * - Sayfalardaki model, boyut, kriter, gösterge gibi aramalarda kullanılır.
 * - Light ve Dark tema ile uyumludur.
 * - Reusable, controlled input'tur.
 */

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchFilterInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  /** İsteğe bağlı debounce; örn. 300 */
  debounceMs?: number;
  /** Debounce sonrası tetiklenir (server sorguları için ideal) */
  onDebouncedChange?: (value: string) => void;
  wrapperClassName?: string;
  inputClassName?: string;
  onClear?: () => void;
}

export const SearchFilterInput = React.forwardRef<HTMLInputElement, SearchFilterInputProps>(
  (
    {
      value,
      onChange,
      debounceMs,
      onDebouncedChange,
      placeholder = "Ara...",
      wrapperClassName,
      inputClassName,
      onClear,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    const [inner, setInner] = React.useState(value);

    // Dış değer değişirse içeri yansıt
    React.useEffect(() => setInner(value), [value]);

    // Debounce
    React.useEffect(() => {
      if (debounceMs && onDebouncedChange) {
        const t = setTimeout(() => onDebouncedChange(inner), debounceMs);
        return () => clearTimeout(t);
      }
    }, [inner, debounceMs, onDebouncedChange]);

    const clear = () => {
      setInner("");
      onChange("");
      onDebouncedChange?.("");
      onClear?.();
    };

    return (
      <div className={cn("relative", wrapperClassName)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          ref={ref}
          type="text"
          value={inner}
          onChange={(e) => {
            setInner(e.target.value);
            onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") clear();
            // Enter: debounce yoksa anlık sorgu yapanlara kolaylık
            if (e.key === "Enter" && !debounceMs && onDebouncedChange) {
              onDebouncedChange(inner);
            }
          }}
          placeholder={placeholder}
          aria-label={ariaLabel || "Arama alanı"}
          className={cn("pl-9 pr-8", inputClassName, className)}
          {...rest}
        />
        {inner && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 outline-none ring-offset-background hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Aramayı temizle"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
SearchFilterInput.displayName = "SearchFilterInput";
