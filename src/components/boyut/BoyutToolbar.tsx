//src/components/boyut/BoyutToolbar.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SmartTextSearch } from "@/components/eslesme/SmartTextSearch";
import { DilMultiSelect } from "@/components/common/DilMultiSelect";
import { DurumMultiSelect, type Durum } from "@/components/common/DurumMultiSelect";
import { FilterChips, type Chip } from "@/components/common/FilterChips";
import { RefreshCw, X, Plus } from "lucide-react";
import type { StatusFilter } from "@/lib/status";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  languageFilter: string | "all";
  onLanguageFilterChange: (v: string | "all") => void;
  selectedLanguages?: string[]; // Seçilen dilleri geçir
  onSelectedLanguagesChange?: (languages: string[]) => void; // Seçilen dilleri güncelle
  onCreate: () => void;
  onRefresh?: () => void;
  hints?: string[];
};

export default function BoyutToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  languageFilter,
  onLanguageFilterChange,
  selectedLanguages = [],
  onSelectedLanguagesChange,
  onCreate,
  onRefresh,
  hints = [],
}: Props) {
  // Çoklu kelime arama için state'ler
  const [searchInput, setSearchInput] = React.useState("");
  const [searchTerms, setSearchTerms] = React.useState<string[]>([]);
  
  // Çoklu seçimler için state'ler
  const [dilAdlari, setDilAdlari] = React.useState<string[]>([]);
  const [aktifler, setAktifler] = React.useState<Durum[]>([]);

  // Arama terimlerini güncelle
  const addSearchTerm = React.useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setSearchTerms(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    setSearchInput("");
  }, []);

  const removeSearchTerm = React.useCallback((term: string) => {
    setSearchTerms(prev => prev.filter(t => t !== term));
  }, []);

  // Çoklu seçimleri tekli seçimlere çevir
  React.useEffect(() => {
    if (dilAdlari.length === 0) {
      onLanguageFilterChange("all");
      onSelectedLanguagesChange?.([]);
    } else if (dilAdlari.length === 1) {
      onLanguageFilterChange(dilAdlari[0]);
      onSelectedLanguagesChange?.([dilAdlari[0]]);
    } else {
      // Birden fazla dil seçildiyse özel bir değer kullan
      onLanguageFilterChange("multiple");
      onSelectedLanguagesChange?.(dilAdlari);
    }
  }, [dilAdlari, onLanguageFilterChange, onSelectedLanguagesChange]);

  React.useEffect(() => {
    if (aktifler.length === 0) {
      onStatusFilterChange("all");
    } else if (aktifler.length === 1) {
      const status = aktifler[0] === 1 ? "active" : aktifler[0] === 2 ? "draft" : "passive";
      onStatusFilterChange(status);
    } else {
      // Birden fazla durum seçildiyse ilkini kullan
      const status = aktifler[0] === 1 ? "active" : aktifler[0] === 2 ? "draft" : "passive";
      onStatusFilterChange(status);
    }
  }, [aktifler, onStatusFilterChange]);

  // Arama terimlerini birleştir
  React.useEffect(() => {
    const combinedSearch = searchTerms.join(" ");
    onSearchChange(combinedSearch);
  }, [searchTerms, onSearchChange]);

  const chips: Chip[] = [
    ...searchTerms.map((term) => ({ 
      id: `search:${term}`, 
      label: `Ara: "${term}"`, 
      onRemove: () => removeSearchTerm(term) 
    })),
    ...dilAdlari.map((dil) => ({ 
      id: `dil:${dil}`, 
      label: `Dil: ${dil}`, 
      onRemove: () => setDilAdlari(prev => prev.filter(d => d !== dil)) 
    })),
    ...aktifler.map((aktif) => ({ 
      id: `aktif:${aktif}`, 
      label: `Durum: ${aktif === 1 ? "Aktif" : aktif === 2 ? "Taslak" : "Pasif"}`, 
      onRemove: () => setAktifler(prev => prev.filter(a => a !== aktif)) 
    })),
  ];

  const clearAll = React.useCallback(() => {
    setSearchTerms([]);
    setDilAdlari([]);
    setAktifler([]);
    setSearchInput("");
  }, []);

  return (
    <div className="bg-background border-b border-border/50">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">Boyutlar</h2>
            <div className="flex items-center gap-2">
              {chips.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {chips.length} filtre aktif
                </span>
              )}
            </div>
          </div>
          <Button onClick={onCreate} size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Boyut
          </Button>
        </div>

        {/* Search & Filters Row */}
        <div className="flex items-center gap-3 mb-3">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSearchTerm(searchInput);
                }
              }}
            >
              <SmartTextSearch
                value={searchInput}
                onChange={setSearchInput}
                hints={hints}
                placeholder="Boyut ara..."
                minChars={1}
                onPick={(v) => addSearchTerm(v)}
              />
            </div>
          </div>

          {/* Language Filter */}
          <div className="w-48">
            <DilMultiSelect 
              value={dilAdlari} 
              onChange={setDilAdlari}
              placeholder="Dil seç"
            />
          </div>

          {/* Status Filter */}
          <div className="w-48">
            <DurumMultiSelect 
              value={aktifler} 
              onChange={setAktifler}
              placeholder="Durum seç"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {chips.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
                <X className="mr-1 h-4 w-4" />
                Temizle
              </Button>
            )}
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh} className="text-muted-foreground hover:text-foreground">
                <RefreshCw className="mr-1 h-4 w-4" />
                Yenile
              </Button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        {chips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <FilterChips
              chips={chips}
              onClearAll={clearAll}
              maxVisible={8}
            />
          </div>
        )}
      </div>
    </div>
  );
}
