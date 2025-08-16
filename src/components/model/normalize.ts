// src/components/model/normalize.ts

import type { ModelApi } from "@/services/modelService";
import type { StatusNum } from "@/lib/status";

// UI için tip tanımları
export interface ModelRowUI {
  id: number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum;
  date: string;
  hierarchy: string;
  type: string;
  hospitalTypes: string[];
  scope: string;
  children?: ModelChildUI[];
}

export interface ModelChildUI {
  id: number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum;
  date: string;
  hierarchy: string;
  type: string;
  hospitalTypes: string[];
  scope: string;
}

export interface ModelDetailUI {
  id: number;
  userType: string;
  dimensionCount: number;
  criteriaCount: number;
  indicatorCount: number;
  answerStatus: string;
  coverageLevels: string;
  status: StatusNum;
}

// API'den UI'a dönüştürme fonksiyonları
export function mapApiToRow(api: ModelApi): ModelRowUI {
  return {
    id: api.modelId,
    name: api.modelResmiAdi,
    shortName: api.modelAliasAdi || "",
    language: api.dilAdi,
    status: api.aktif === 1 ? 1 : api.aktif === 2 ? 2 : 0,
    date: api.olusturmaZamani,
    hierarchy: api.hiyerarsiAciklama,
    type: api.seviyeAraligi ? `Seviyeli (${api.seviyeAraligi})` : api.modelTuruAdi,
    hospitalTypes: api.hastaneTurleri,
    scope: api.kullaniciKapsami,
    children: api.children?.map(mapChildApiToUI),
  };
}

export function mapChildApiToUI(api: ModelApi): ModelChildUI {
  return {
    id: api.modelId,
    name: api.modelResmiAdi,
    shortName: api.modelAliasAdi || "",
    language: api.dilAdi,
    status: api.aktif === 1 ? 1 : api.aktif === 2 ? 2 : 0,
    date: api.olusturmaZamani,
    hierarchy: api.hiyerarsiAciklama,
    type: api.seviyeAraligi ? `Seviyeli (${api.seviyeAraligi})` : api.modelTuruAdi,
    hospitalTypes: api.hastaneTurleri,
    scope: api.kullaniciKapsami,
  };
}
