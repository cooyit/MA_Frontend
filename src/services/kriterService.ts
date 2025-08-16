// src/services/kriterService.ts

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5063";

export interface KriterTreeApi {
  kriterId: number;
  kriterAdi: string;
  kriterAlias: string;
  aktif: number | null;
  dilAdi: string;
  olusturmaZamani: string;
  translations: KriterTreeApi[];
}

export interface KriterModelApi {
  modelId: number;
  modelAdi: string;
  boyutId: number;
  boyutAdi: string;
  boyutAgirligi?: number;
  kriterAgirligi?: number;
  kriterModelAgirligi?: number;
  gostergeSayisi?: number;
  seviyeId?: number;
  seviyeAdi?: string;
}

// Eşleşmeler servisinden gösterge sayısını çekmek için
export interface KriterNavigationApi {
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

export function fetchKriterTree(signal?: AbortSignal) {
  return http<KriterTreeApi[]>("/api/Kriterler/tree", { signal });
}

export function fetchKriterModels(kriterId: number, signal?: AbortSignal) {
  return http<KriterModelApi[]>(`/api/Kriterler/${kriterId}/models`, { signal });
}


// Eşleşmeler servisinden navigasyon verisi çek
export function fetchKriterNavigation(_kriterId: number, signal?: AbortSignal) {
  return http<KriterNavigationApi[]>("/api/Eslesme/navigation", { 
    signal,
    method: "GET",
    headers: { Accept: "application/json" }
  });
}
