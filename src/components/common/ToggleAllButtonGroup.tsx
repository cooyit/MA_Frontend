//src/components/common/ToggleAllButtonGroup.tsx
"use client";

/**
 * ToggleAllButtonGroup - Tümünü Aç / Tümünü Kapat buton grubu
 *
 * - Ağaç veya liste yapısında tüm satırları açmak/kapatmak için kullanılır.
 * - Light/Dark tema uyumludur.
 * - Dışarıdan callback atanabilir.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleAllButtonGroupProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  className?: string;
  /** Hedef bölgenin id'si (a11y için) */
  controlsId?: string;
  /** Buton boyutu (shadcn) */
  size?: "default" | "sm" | "lg" | "icon";
  /** Buton variant'ı (shadcn) */
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  /** Her iki butonu da devre dışı bırak */
  disabled?: boolean;
  /** Etiketleri özelleştirme */
  labels?: {
    collapse?: string; // Tümünü Kapat
    expand?: string;   // Tümünü Aç
  };
  /** Sadece ikon göster (compact mod) */
  iconOnly?: boolean;
}

export const ToggleAllButtonGroup: React.FC<ToggleAllButtonGroupProps> = ({
  onExpandAll,
  onCollapseAll,
  className = "",
  controlsId,
  size = "default",
  variant = "secondary",
  disabled = false,
  labels = { collapse: "Tümünü Kapat", expand: "Tümünü Aç" },
  iconOnly = false,
}) => {
  return (
    <div className={cn("flex gap-2", className)} role="group" aria-label="Toplu aç/kapat">
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={onCollapseAll}
        aria-controls={controlsId}
        aria-label={labels.collapse}
        disabled={disabled}
        title={labels.collapse}
      >
        <ChevronUp className={cn("mr-2 h-4 w-4", iconOnly && "mr-0")} aria-hidden="true" />
        {!iconOnly && labels.collapse}
      </Button>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={onExpandAll}
        aria-controls={controlsId}
        aria-label={labels.expand}
        disabled={disabled}
        title={labels.expand}
      >
        <ChevronDown className={cn("mr-2 h-4 w-4", iconOnly && "mr-0")} aria-hidden="true" />
        {!iconOnly && labels.expand}
      </Button>
    </div>
  );
};
