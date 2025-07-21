// components/common/ToggleAllButtonGroup.tsx
/**
 * ToggleAllButtonGroup - Tümünü Aç / Tümünü Kapat buton bileşeni
 *
 * Açıklama:
 * - Ağaç veya liste yapısında tüm satırları açmak/kapatmak için kullanılır.
 * - Light/Dark tema uyumludur.
 * - Butonlara dışarıdan callback atanabilir.
 */

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

interface ToggleAllButtonGroupProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  className?: string;
}

export const ToggleAllButtonGroup: React.FC<ToggleAllButtonGroupProps> = ({
  onExpandAll,
  onCollapseAll,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button variant="secondary" onClick={onCollapseAll}>
        <ChevronUp className="w-4 h-4 mr-2" />
        Tümünü Kapat
      </Button>
      <Button variant="secondary" onClick={onExpandAll}>
        <ChevronDown className="w-4 h-4 mr-2" />
        Tümünü Aç
      </Button>
    </div>
  );
};
