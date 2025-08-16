// src/services/modelService.ts

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5063";

export interface ModelApi {
  modelId: number;
  modelResmiAdi: string;
  modelAliasAdi?: string;
  modelAciklama?: string;
  etiketler?: string;
  dilAdi: string;
  olusturmaZamani: string;
  devreyeAlmaTarihi?: string;
  devredenKaldirilmaTarihi?: string;
  aktif: number;
  hiyerarsi: boolean;
  hiyerarsiAciklama: string;
  modelTuruId: number;
  modelTuruAdi: string;
  kullaniciKapsami: string;
  kullaniciTurleri: KullaniciTuruApi[];
  seviyeAraligi?: string;
  hastaneTurleri: string[];
  children?: ModelApi[];
}

export interface KullaniciTuruApi {
  kullaniciTuruId: number;
  kullaniciTuruAdi: string;
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

export function fetchModels(signal?: AbortSignal) {
  return http<ModelApi[]>("/api/Modeller", { signal });
}

export interface ModelDetailApi {
  modelId: number;
  kullaniciTuruAdi: string;
  boyutSayisi: number;
  kriterSayisi: number;
  gostergeSayisi: number;
  cevapEklenmeDurumu: string;
  aktif: number;
}

export function fetchModelDetails(modelId: number, signal?: AbortSignal) {
  return http<ModelDetailApi[]>(`/api/Modeller/${modelId}/details`, { signal });
}
