// src/services/dilService.ts
export type DilOption = { dilId: number; dilAdi: string };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5063";

/** Tek imza: RequestInit (signal dahil) */
export async function getDiller(options?: RequestInit): Promise<DilOption[]> {
  const res = await fetch(`${API_BASE}/api/Diller/select`, {
    headers: { Accept: "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`getDiller failed: ${res.status} ${res.statusText}`);
  const data: DilOption[] = await res.json();
  // Tutarlı UX için alfabetik sırala
  return data.slice().sort((a, b) => a.dilAdi.localeCompare(b.dilAdi, "tr"));
}
