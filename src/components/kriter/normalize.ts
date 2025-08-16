// src/components/kriter/normalize.ts

import type { KriterTreeApi, KriterModelApi } from "@/services/kriterService";
import type { StatusNum } from "@/lib/status";

// UI için tip tanımları
export interface KriterRowUI {
  id: number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum;
  date: string;
  translations?: KriterTranslationUI[];
}

export interface KriterTranslationUI {
  id: number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum;
  date: string;
}

export interface KriterModelUI {
  id: number;
  name: string;
  boyutName: string;
  boyutWeight: number;
  kriterWeight: number;
  modelWeight: number;
  gostergeSayisi: number;
  seviye: string;
}

// API'den UI'a dönüştürme fonksiyonları
export function mapTreeApiToRow(api: KriterTreeApi): KriterRowUI {
  return {
    id: api.kriterId,
    name: api.kriterAdi,
    shortName: api.kriterAlias,
    language: api.dilAdi,
    status: (api.aktif ?? 0) as StatusNum,
    date: api.olusturmaZamani,
    translations: api.translations?.map(mapTranslationApiToUI),
  };
}

export function mapTranslationApiToUI(api: KriterTreeApi): KriterTranslationUI {
  return {
    id: api.kriterId,
    name: api.kriterAdi,
    shortName: api.kriterAlias,
    language: api.dilAdi,
    status: (api.aktif ?? 0) as StatusNum,
    date: api.olusturmaZamani,
  };
}

export function mapModelApiToRow(api: KriterModelApi): KriterModelUI {
  return {
    id: api.modelId,
    name: api.modelAdi,
    boyutName: api.boyutAdi,
    boyutWeight: api.boyutAgirligi || 0,
    kriterWeight: api.kriterAgirligi || 0,
    modelWeight: api.kriterModelAgirligi || 0,
    gostergeSayisi: api.gostergeSayisi || 0,
    seviye: api.seviyeAdi || "Puanlı",
  };
}
