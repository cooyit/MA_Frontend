// src/services/boyutService.ts
export type BoyutTreeApi = {
    BoyutId: number;
    BoyutAdi?: string | null;
    BoyutAllias?: string | null;
    Aktif?: string | null;        // "Aktif" | "Taslak" | "Pasif"
    DilAdi?: string | null;       // "Türkçe", "English", ...
    OlusturmaZamani?: string | null; // ISO string gelecek
    Translations?: BoyutTreeApi[] | null;
  };
  
  export type BoyutModelApi = {
    ModelId: number;
    ModelAdi: string;
    KriterSayisi: number;
    GostergeSayisi: number;
    ModelAgirligi?: number | null;
    KarsilanmaDuzeyi: string;
  };
  
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5063";
  
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
  
  /** Üst tablo + çeviri ağacı */
  export function fetchBoyutTree(signal?: AbortSignal) {
    return http<BoyutTreeApi[]>("/api/Boyutlar/tree", { signal });
  }
  
  /** Alt tablo: seçilen boyuta bağlı modeller */
  export function fetchBoyutModels(boyutId: number, signal?: AbortSignal) {
    return http<BoyutModelApi[]>(`/api/Boyutlar/${boyutId}/models`, { signal });
  }
  