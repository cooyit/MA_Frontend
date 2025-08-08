/** @file Model eşleşme ağacını (Model→Boyut→[Kriter→]Gösterge) API'den çeker; UI’de kullanılan DTO tiplerini tanımlar ve normalize eder. */

import { toStatusNumber } from "@/lib/status"

/* ============================== */
/*            DTO'lar             */
/* ============================== */

export interface NavigationFilter {
  modelId?: number
  boyutId?: number
  kriterId?: number
  gostergeId?: number
  aktif?: number
  modelKelime?: string
  boyutKelime?: string
  kriterKelime?: string
  gostergeKelime?: string
  /** Yalnızca MODEL dili (backend Model.DilAdi'na uygulanır) */
  dilAdi?: string
  dilAdlari?: string[]
  aktifler?: number[]
  modelKelimeler?: string[];
  boyutKelimeler?: string[];
  kriterKelimeler?: string[];
  gostergeKelimeler?: string[];
}

/** Leaf: Gösterge düğümü */
export interface GostergeNavigasyonDto {
  gostergeId: number
  gostergeAdi: string
  eslesmeId: number
  aktif: number | string
  Aktif?: number | string
  /** model içindeki ağırlık (opsiyonel) */
  Agirlik?: number 
  BoyutIciAgirlik?: number
  modelIciAgirlik?: number

}

/** Orta düğüm: Kriter */
export interface KriterNavigasyonDto {
  kriterId: number
  kriterAdi: string
  aktif: number | string
  Aktif?: number | string
  /** bu kriter altındaki gösterge sayısı */
  gostergeSayisi: number
  /** (Boyut * Kriter)/100 – opsiyonel */
  Agirlik?: number 
  modelIciAgirlik?: number
  gostergeler: GostergeNavigasyonDto[]
}

/** Orta düğüm: Boyut */
export interface BoyutNavigasyonDto {
  boyutId: number
  boyutAdi: string
  aktif: number | string
  Aktif?: number | string


  /** bu boyuttaki kriter sayısı (hiyerarşi true olsa da sayılabilir) */
  kriterSayisi: number
  /** bu boyuttaki toplam gösterge sayısı */
  gostergeSayisi: number
  /** Eslesmeler.Agirligi – yüzde, opsiyonel */
  ModelIciAgirlik?: number

  /** Hiyerarşi düz ise (Model→Boyut→Gösterge) backend burayı doldurur */
  gostergeler?: GostergeNavigasyonDto[]
  /** Klasik yapı (Model→Boyut→Kriter→Gösterge) ise burası dolar */
  kriterler: KriterNavigasyonDto[]
}

/** Kök: Model */
export interface ModelNavigasyonDto {
  modelId: number
  modelAdi: string
  aktif: number | string
  Aktif?: number | string
  /** true: Boyut→Gösterge, false: Boyut→Kriter→Gösterge */
  hiyerarsi?: boolean
  /** Model dili (filtre için) */
  dilAdi?: string
  /** Top-level özetler (opsiyonel; backend dolu gönderirse UI gösterir) */
  boyutSayisi?: number
  kriterSayisi?: number
  gostergeSayisi?: number

  boyutlar: BoyutNavigasyonDto[]
}

/* ============================== */
/*          API yardımcıları      */
/* ============================== */

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5063"



/* ============================== */
/*            Normalize           */
/* ============================== */

/** API'den gelen ağaç yapısını tek seferde normalize eder. */
// services/eslesmeService.ts

/** number | undefined parse */
function numOrU(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** API'den gelen ağaç yapısını TEK isim setine indirger. */
export function normalizeNavigation(models: ModelNavigasyonDto[]): ModelNavigasyonDto[] {
  return models.map((m) => {
    const aktif            = toStatusNumber((m as any).aktif ?? (m as any).Aktif)
    const dilAdi           = (m as any).dilAdi ?? (m as any).DilAdi
    const boyutSayisi      = numOrU((m as any).boyutSayisi      ?? (m as any).BoyutSayisi)
    const kriterSayisi     = numOrU((m as any).kriterSayisi     ?? (m as any).KriterSayisi)
    const gostergeSayisi   = numOrU((m as any).gostergeSayisi   ?? (m as any).GostergeSayisi)

    const boyutlar = (m.boyutlar ?? []).map((b) => {
      const bAktif           = toStatusNumber((b as any).aktif ?? (b as any).Aktif)
      const bKriterSayisi    = numOrU((b as any).kriterSayisi    ?? (b as any).KriterSayisi) ?? 0
      const bGostergeSayisi  = numOrU((b as any).gostergeSayisi  ?? (b as any).GostergeSayisi) ?? 0

      // Backend boyut ağırlığını "modelIciAgirlik" adıyla veriyor:
      const boyutIciAgirlik  = numOrU(
        (b as any).boyutIciAgirlik ?? (b as any).BoyutIciAgirlik ??
        (b as any).modelIciAgirlik ?? (b as any).ModelIciAgirlik
      )

      const kriterler = (b.kriterler ?? []).map((k) => {
        const kAktif            = toStatusNumber((k as any).aktif ?? (k as any).Aktif)
        const gSy               = numOrU((k as any).gostergeSayisi ?? (k as any).GostergeSayisi) ?? 0
        const modelIciAgirlik   = numOrU((k as any).modelIciAgirlik ?? (k as any).ModelIciAgirlik)
        const kriterIciAgirlik  = numOrU((k as any).kriterIciAgirlik ?? (k as any).KriterIciAgirlik ?? (k as any).agirlik ?? (k as any).Agirlik)

        const gostergeler = (k.gostergeler ?? []).map((g) => ({
          ...g,
          aktif: toStatusNumber((g as any).aktif ?? (g as any).Aktif),
          // gösterge için 3 ayrı yüzdeyi de normalize et
          modelIciAgirlik : numOrU((g as any).modelIciAgirlik  ?? (g as any).ModelIciAgirlik),
          boyutIciAgirlik : numOrU((g as any).boyutIciAgirlik  ?? (g as any).BoyutIciAgirlik),
          kriterIciAgirlik: numOrU((g as any).kriterIciAgirlik ?? (g as any).KriterIciAgirlik ?? (g as any).agirlik ?? (g as any).Agirlik),
        }))

        return {
          ...k,
          aktif: kAktif,
          gostergeSayisi: gSy,
          modelIciAgirlik,
          kriterIciAgirlik,
          gostergeler,
        }
      })

      // Hiyerarşi direkt gösterge ise:
      const gostergeler = b.gostergeler
        ? b.gostergeler.map((g) => ({
            ...g,
            aktif: toStatusNumber((g as any).aktif ?? (g as any).Aktif),
            modelIciAgirlik : numOrU((g as any).modelIciAgirlik  ?? (g as any).ModelIciAgirlik),
            boyutIciAgirlik : numOrU((g as any).boyutIciAgirlik  ?? (g as any).BoyutIciAgirlik),
            kriterIciAgirlik: numOrU((g as any).kriterIciAgirlik ?? (g as any).KriterIciAgirlik ?? (g as any).agirlik ?? (g as any).Agirlik),
          }))
        : undefined

      return {
        ...b,
        aktif: bAktif,
        kriterSayisi   : bKriterSayisi,
        gostergeSayisi : bGostergeSayisi,
        boyutIciAgirlik,
        kriterler,
        gostergeler,
      }
    })

    return {
      ...m,
      aktif,
      dilAdi,
      boyutSayisi,
      kriterSayisi,
      gostergeSayisi,
      boyutlar,
    }
  })
}


/* ============================== */
/*             Service            */
/* ============================== */

/** Esleşme navigasyon ağacını API'den getirir (normalize edilmiş döner). */
// src/services/eslesmeService.ts
// src/services/eslesmeService.ts
export async function getModelNavigation(
  filter: NavigationFilter,
  options?: RequestInit
) {
  const params = new URLSearchParams();
  const append = (k: string, v: string | number) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  };

  // diziler — hepsinde parametre tipini yazdım
  filter.dilAdlari?.forEach((v: string) => append("DilAdlari", v));
  filter.aktifler?.forEach((v: number) => append("Aktifler", v));
  filter.modelKelimeler?.forEach((v: string) => append("ModelKelimeler", v));
  filter.boyutKelimeler?.forEach((v: string) => append("BoyutKelimeler", v));
  filter.kriterKelimeler?.forEach((v: string) => append("KriterKelimeler", v)); // <-- ForEach değil!
  filter.gostergeKelimeler?.forEach((v: string) => append("GostergeKelimeler", v));

  // tekiller (opsiyonel)
  append("DilAdi", filter.dilAdi as any);
  append("Aktif", filter.aktif as any);
  append("ModelKelime", filter.modelKelime as any);
  append("BoyutKelime", filter.boyutKelime as any);
  append("KriterKelime", filter.kriterKelime as any);
  append("GostergeKelime", filter.gostergeKelime as any);

  const res = await fetch(
    `${API_BASE}/api/Eslesme/navigation?${params.toString()}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      ...options,
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

