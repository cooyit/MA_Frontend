// src/components/gosterge/normalize.ts

import type { GostergeTreeApi, GostergeModelApi } from "@/services/gostergeService";
import type { StatusNum } from "@/lib/status";

// UI için tip tanımları
export interface GostergeRowUI {
  id: number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum;
  date: string;
  cevapTuruAdlari: string[];
  children?: GostergeChildUI[];
}

export interface GostergeChildUI {
  id: number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum;
  date: string;
  cevapTuruAdlari: string[];
}

export interface GostergeModelUI {
  id: number;
  name: string;
  boyutName: string;
  kriterName?: string;
  boyutWeight: number;
  kriterWeight: number;
  gostergeWeight: number;
  modelWeight: number;
  seviye: string;
  hiyerarsiTipi: string;
}

// API'den UI'a dönüştürme fonksiyonları
export function mapTreeApiToRow(api: GostergeTreeApi): GostergeRowUI {
  return {
    id: api.gostergeId,
    name: api.gostergeAdi,
    shortName: api.gostergeAllias,
    language: api.dilAdi,
    status: (api.aktif ?? 0) as StatusNum,
    date: api.olusturmaZamani,
    cevapTuruAdlari: api.cevapTuruAdlari || [],
    children: api.children?.map(mapChildApiToUI),
  };
}

export function mapChildApiToUI(api: GostergeTreeApi): GostergeChildUI {
  return {
    id: api.gostergeId,
    name: api.gostergeAdi,
    shortName: api.gostergeAllias,
    language: api.dilAdi,
    status: (api.aktif ?? 0) as StatusNum,
    date: api.olusturmaZamani,
    cevapTuruAdlari: api.cevapTuruAdlari || [],
  };
}

export function mapModelApiToRow(api: GostergeModelApi): GostergeModelUI {
  return {
    id: api.modelId,
    name: api.modelAdi,
    boyutName: api.boyutAdi,
    kriterName: api.kriterAdi,
    boyutWeight: api.boyutAgirligi || 0,
    kriterWeight: api.kriterAgirligi || 0,
    gostergeWeight: api.gostergeAgirligi || 0,
    modelWeight: api.modelAgirligi || 0,
    seviye: api.seviyeAdi || "-",
    hiyerarsiTipi: api.hiyerarsiTipi,
  };
}
