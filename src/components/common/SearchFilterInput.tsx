// components/common/SearchFilterInput.tsx

/**
 * SearchFilterInput - Ortak filtre arama input bileşeni
 *
 * Açıklama:
 * - Sayfalardaki model, boyut, kriter, gösterge gibi aramalarda kullanılır.
 * - Light ve Dark tema ile uyumludur.
 * - Reusable, controlled input'tur.
 */

import { Search } from 'lucide-react'; // ikon için
import { Input } from '@/components/ui/input'; // shadcn input bileşeni
import React from 'react';

interface SearchFilterInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchFilterInput: React.FC<SearchFilterInputProps> = ({
  placeholder = 'Ara...',
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};

