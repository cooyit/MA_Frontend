// src/components/boyut/normalize.ts
import { StatusNum, toStatusNumber } from "@/lib/status";

/* --- Senin mevcut düz DTO map'lerin (dokunmadım) --- */
export type BoyutApi = {
  BoyutId: number;
  BoyutAllias?: string | null;
  BoyutAdi?: string | null;
  BoyutEtiketleri?: string | null;
  Aktif?: number | boolean | string | null;
  DilAdi?: string | null;
};

export function fromApi(dto: BoyutApi) {
  return {
    id: dto.BoyutId,
    name: dto.BoyutAdi ?? "",
    shortName: dto.BoyutAllias ?? "",
    language: dto.DilAdi ?? "Türkçe",
    status: toStatusNumber(dto.Aktif) as StatusNum,
    tags: (dto.BoyutEtiketleri ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function toApi(ui: {
  id: number; name: string; shortName: string; language: string; status: StatusNum; tags: string[];
}): BoyutApi {
  return {
    BoyutId: ui.id,
    BoyutAdi: ui.name,
    BoyutAllias: ui.shortName,
    DilAdi: ui.language,
    Aktif: ui.status as number,
    BoyutEtiketleri: ui.tags.join(","),
  };
}
/* --------------------------------------------------- */

/** Yardımcı: objeden (case-insensitive) alan seç */
function pick<T = any>(o: any, names: string[], fallback?: T): T {
  for (const n of names) if (o && o[n] != null) return o[n] as T;
  return fallback as T;
}

/** /api/Boyutlar/tree dönen raw tip (camel/pascal karışık olabilir) */
export type BoyutTreeApi = any;

/** UI: Üst tablodaki satır */
export type BoyutRowUI = {
  id: number;
  name: string;
  shortName: string;
  language: string;
  status: StatusNum | "Aktif" | "Taslak" | "Pasif";
  date?: string;
  translations?: Array<{
    id: number;                // <-- EKLENDİ
    language: string;
    name: string;
    shortName: string;
    status: StatusNum | "Aktif" | "Taslak" | "Pasif";
    date?: string;
  }>;
};

export function mapTreeApiToRow(dto: BoyutTreeApi): BoyutRowUI {
  const id = pick<number>(dto, ["BoyutId", "boyutId"], 0);
  const name = pick<string>(dto, ["BoyutAdi", "boyutAdi"], "");
  const shortName = pick<string>(dto, ["BoyutAllias", "boyutAllias"], "");
  const language = pick<string>(dto, ["DilAdi", "dilAdi"], "");
  const aktifLike = pick<any>(dto, ["Aktif", "aktif"], undefined);
  const date = pick<string>(dto, ["OlusturmaZamani", "olusturmaZamani"], undefined);
  const trans = pick<any[]>(dto, ["Translations", "translations"], []) || [];

  return {
    id,
    name,
    shortName,
    language,
    status: aktifLike ?? "Pasif",
    date,
    translations: trans.map((t) => ({
      id: pick<number>(t, ["BoyutId", "boyutId"], 0),     // <-- EKLENDİ
      language: pick<string>(t, ["DilAdi", "dilAdi"], ""),
      name: pick<string>(t, ["BoyutAdi", "boyutAdi"], ""),
      shortName: pick<string>(t, ["BoyutAllias", "boyutAllias"], ""),
      status: pick<any>(t, ["Aktif", "aktif"], "Pasif"),
      date: pick<string>(t, ["OlusturmaZamani", "olusturmaZamani"], undefined),
    })),
  };
}

/** /api/Boyutlar/{id}/models raw */
export type BoyutModelApi = any;

export type ModelSummaryUI = {
  id: number;
  name: string;
  criteriaCount: number;
  indicatorCount: number;
  weight: number;
  coverageLevel: string;
};

export function mapModelApiToRow(dto: BoyutModelApi): ModelSummaryUI {
  return {
    id: pick<number>(dto, ["ModelId", "modelId"], 0),
    name: pick<string>(dto, ["ModelAdi", "modelAdi"], ""),
    criteriaCount: pick<number>(dto, ["KriterSayisi", "kriterSayisi"], 0),
    indicatorCount: pick<number>(dto, ["GostergeSayisi", "gostergeSayisi"], 0),
    weight: pick<number>(dto, ["ModelAgirligi", "modelAgirligi"], 0),
    coverageLevel: pick<string>(dto, ["KarsilanmaDuzeyi", "karsilanmaDuzeyi"], ""),
  };
}
