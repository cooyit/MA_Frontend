// src/services/dilService.ts (iyileştirilmiş sürüm – interface’i bozmaz)
export type DilOption = { dilId: number; dilAdi: string };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5063";

export async function getDiller(options?: RequestInit): Promise<DilOption[]> {
  try {
    const res = await fetch(new URL("/api/Diller/select", API_BASE).toString(), {
      headers: { Accept: "application/json", ...(options?.headers ?? {}) },
      ...options,
    });
    if (!res.ok) throw new Error(`getDiller failed: ${res.status} ${res.statusText}`);

    const data: DilOption[] = await res.json();
    return data
      .slice()
      .sort((a, b) => a.dilAdi.localeCompare(b.dilAdi, "tr", { sensitivity: "base" }));
  } catch (err: any) {
    // AbortError ise üst katmana gürültü yapmayalım (isterseniz null/[] dönebilirsiniz)
    if (err?.name === "AbortError") {
      // İptal durumunu sessizce üst katmana fırlatmak yerine özel mesaj da verebilirsiniz
      throw err;
    }
    throw err;
  }
}

/* (Opsiyonel) Çok basit bir TTL cache (örn. 5 dk). İsterseniz useDiller içinde kullanın.
let _dilCache: { at: number; data: DilOption[] } | null = null;
export async function getDillerCached(options?: RequestInit, ttlMs = 5 * 60_000) {
  const now = Date.now();
  if (_dilCache && now - _dilCache.at < ttlMs) return _dilCache.data;
  const data = await getDiller(options);
  _dilCache = { at: now, data };
  return data;
}
*/
