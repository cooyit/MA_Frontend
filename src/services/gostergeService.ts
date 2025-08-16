// src/services/gostergeService.ts

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5063";

export interface GostergeTreeApi {
  gostergeId: number;
  gostergeAdi: string;
  gostergeAllias: string;
  dilAdi: string;
  olusturmaZamani: string;
  cevapTuruAdlari: string[];
  children: GostergeTreeApi[];
}

export interface GostergeModelApi {
  modelId: number;
  modelAdi: string;
  boyutId: number;
  boyutAdi: string;
  kriterId?: number;
  kriterAdi?: string;
  boyutAgirligi?: number;
  kriterAgirligi?: number;
  gostergeAgirligi?: number;
  modelAgirligi?: number;
  seviyeId?: number;
  seviyeAdi?: string;
  hiyerarsiTipi: string;
}

// Eşleşmeler servisinden gösterge sayısını çekmek için
export interface GostergeNavigationApi {
  modelId: number;
  modelAdi: string;
  boyutlar: {
    boyutId: number;
    boyutAdi: string;
    gostergeSayisi: number;
    kriterler: {
      kriterId: number;
      kriterAdi: string;
      gostergeSayisi: number;
      gostergeler: {
        gostergeId: number;
        gostergeAdi: string;
      }[];
    }[];
  }[];
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${init?.method ?? "GET"} ${path} failed: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json() as Promise<T>;
}

export function fetchGostergeTree(signal?: AbortSignal) {
  return http<GostergeTreeApi[]>("/api/Gostergeler/tree", { signal });
}

export function fetchGostergeModels(gostergeId: number, signal?: AbortSignal) {
  return http<GostergeModelApi[]>(`/api/Gostergeler/${gostergeId}/models`, { signal });
}

// Eşleşmeler servisinden navigasyon verisi çek
export function fetchGostergeNavigation(gostergeId: number, signal?: AbortSignal) {
  return http<GostergeNavigationApi[]>("/api/Eslesme/navigation", { 
    signal,
    method: "GET",
    headers: { Accept: "application/json" }
  });
}
