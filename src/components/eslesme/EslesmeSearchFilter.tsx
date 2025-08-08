// src/components/eslesme/EslesmeSearchFilter.tsx
"use client";

import * as React from "react";
import { SmartTextSearch } from "@/components/eslesme/SmartTextSearch";
import { Button } from "@/components/ui/button";
import { DilMultiSelect } from "@/components/common/DilMultiSelect";
import { DurumMultiSelect, type Durum } from "@/components/common/DurumMultiSelect";
import { FilterChips, type Chip } from "@/components/common/FilterChips";
import type { NavigationFilter } from "@/services/eslesmeService";
import { RefreshCw, X } from "lucide-react";

/* ---------- EnterAddField'i DOSYA SEVİYESİNDE tanımla ---------- */
type EnterAddFieldProps = {
  value: string;
  setValue: (v: string) => void;
  hints?: string[];
  placeholder: string;
  onAdd: (v: string) => void;
};

const EnterAddField = React.memo(function EnterAddField({
  value, setValue, hints = [], placeholder, onAdd,
}: EnterAddFieldProps) {
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const v = value.trim();
          if (v) { onAdd(v); setValue(""); }
        }
      }}
    >
      <SmartTextSearch
        value={value}
        onChange={setValue}
        hints={hints}
        placeholder={placeholder}
        minChars={1}
        onPick={(v) => { onAdd(v); setValue(""); }}
      />
    </div>
  );
});

/* ------------------------- Ana bileşen ------------------------- */

export type HintPool = {
  model?: string[];
  boyut?: string[];
  kriter?: string[];
  gosterge?: string[];
};

export function EslesmeSearchFilter({
  onSearch, hints, resetKey = 0, onRefresh,
}: {
  onSearch: (f: NavigationFilter) => void;
  hints?: HintPool;
  resetKey?: number;
  onRefresh?: () => void;         // <-- yeni
}) {
  // Tekli inputlar
  const [modelInput, setModelInput] = React.useState("");
  const [boyutInput, setBoyutInput] = React.useState("");
  const [kriterInput, setKriterInput] = React.useState("");
  const [gostergeInput, setGostergeInput] = React.useState("");

  // Çoklu terimler (chip)
  const [modelKelimeler, setModelKelimeler] = React.useState<string[]>([]);
  const [boyutKelimeler, setBoyutKelimeler] = React.useState<string[]>([]);
  const [kriterKelimeler, setKriterKelimeler] = React.useState<string[]>([]);
  const [gostergeKelimeler, setGostergeKelimeler] = React.useState<string[]>([]);

  // Çoklu seçimler
  const [dilAdlari, setDilAdlari] = React.useState<string[]>([]);
  const [aktifler, setAktifler] = React.useState<Durum[]>([]);

  const addTerm = React.useCallback(
    (val: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
      const v = val.trim();
      if (!v) return;
      setList((arr) => (arr.includes(v) ? arr : [...arr, v]));
    },
    []
  );

  // payload
  const payload = React.useMemo<NavigationFilter>(() => {
    const aktifNums = (aktifler ?? []).map(Number).filter((x) => Number.isFinite(x));
    return {
      dilAdlari: dilAdlari.length ? dilAdlari : undefined,
      aktifler : aktifNums.length ? aktifNums : undefined,
      modelKelimeler   : modelKelimeler.length ? modelKelimeler : undefined,
      boyutKelimeler   : boyutKelimeler.length ? boyutKelimeler : undefined,
      kriterKelimeler  : kriterKelimeler.length ? kriterKelimeler : undefined,
      gostergeKelimeler: gostergeKelimeler.length ? gostergeKelimeler : undefined,
    };
  }, [dilAdlari, aktifler, modelKelimeler, boyutKelimeler, kriterKelimeler, gostergeKelimeler]);

  // tek effect ile gönder
  const payloadKey = React.useMemo(() => JSON.stringify(payload), [payload]);
  React.useEffect(() => {
    onSearch(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadKey]);

  // dış reset
  const resetOnly = React.useCallback(() => {
    setModelInput(""); setBoyutInput(""); setKriterInput(""); setGostergeInput("");
    setModelKelimeler([]); setBoyutKelimeler([]); setKriterKelimeler([]); setGostergeKelimeler([]);
    setDilAdlari([]); setAktifler([]);
  }, []);

  React.useEffect(() => { resetOnly(); }, [resetKey, resetOnly]);

  const clearAll = React.useCallback(() => { resetOnly(); }, [resetOnly]);

  const chips: Chip[] = [
    ...modelKelimeler.map((t) => ({ id:`m:${t}`, label:`model: "${t}"`, onRemove:()=>setModelKelimeler(a=>a.filter(x=>x!==t)) })),
    ...boyutKelimeler.map((t) => ({ id:`b:${t}`, label:`boyut: "${t}"`, onRemove:()=>setBoyutKelimeler(a=>a.filter(x=>x!==t)) })),
    ...kriterKelimeler.map((t) => ({ id:`k:${t}`, label:`kriter: "${t}"`, onRemove:()=>setKriterKelimeler(a=>a.filter(x=>x!==t)) })),
    ...gostergeKelimeler.map((t) => ({ id:`g:${t}`, label:`gösterge: "${t}"`, onRemove:()=>setGostergeKelimeler(a=>a.filter(x=>x!==t)) })),
    ...dilAdlari.map((d) => ({ id:`dil:${d}`, label:`dil: ${d}`, onRemove:()=>setDilAdlari(arr=>arr.filter(x=>x!==d)) })),
    ...aktifler.map((a) => ({ id:`aktif:${a}`, label:`durum: ${a===1 ? "Aktif" : a===0 ? "Pasif" : "Taslak"}`, onRemove:()=>setAktifler(arr=>arr.filter(x=>x!==a)) })),
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <EnterAddField
          value={modelInput}
          setValue={setModelInput}
          hints={hints?.model}
          placeholder="Model Ara (Enter ile ekle)"
          onAdd={(v)=>addTerm(v, setModelKelimeler)}
        />
        
        <EnterAddField
          value={boyutInput}
          setValue={setBoyutInput}
          hints={hints?.boyut}
          placeholder="Boyut Ara (Enter ile ekle)"
          onAdd={(v)=>addTerm(v, setBoyutKelimeler)}
        />
        <EnterAddField
          value={kriterInput}
          setValue={setKriterInput}
          hints={hints?.kriter}
          placeholder="Kriter Ara (Enter ile ekle)"
          onAdd={(v)=>addTerm(v, setKriterKelimeler)}
        />
        <EnterAddField
          value={gostergeInput}
          setValue={setGostergeInput}
          hints={hints?.gosterge}
          placeholder="Gösterge Ara (Enter ile ekle)"
          onAdd={(v)=>addTerm(v, setGostergeKelimeler)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <DilMultiSelect value={dilAdlari} onChange={setDilAdlari} />
        <DurumMultiSelect value={aktifler} onChange={setAktifler} />
        <div className="flex items-center gap-2 md:col-span-2 justify-end">
          <Button variant="outline" onClick={clearAll}>
            <X className="mr-2 h-4 w-4" />
            Temizle
          </Button>

          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Yenile
            </Button>
          )}

          <Button onClick={() => onSearch(payload)}>Listele</Button>
        </div>
      </div>

      <FilterChips chips={chips} />
    </div>
  );
}
