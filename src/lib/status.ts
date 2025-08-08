// src/lib/status.ts
/** @file Status yardımcıları: tek doğruluk noktası. 
 *  API'den gelen 0/1/2, "0"/"1"/"2", true/false veya "Aktif/Taslak/Pasif" gibi
 *  değerleri normalize eder ve UI etiketleri/yardımcıları sağlar.
 */

export type StatusNum = 0 | 1 | 2
export type StatusStr = "Pasif" | "Aktif" | "Taslak"

/** objeden aktif/Aktif'i okuyup normalize eder */
export function getStatus(obj: Record<string, any>): StatusNum {
  return toStatusNumber(obj?.aktif ?? obj?.Aktif)
}

/** Verilen değeri (number/string/bool) 0/1/2 durum koduna çevirir. */
export function toStatusNumber(v: unknown): StatusNum {
  if (v === 1 || v === 2 || v === 0) return v
  if (v === "1" || v === "2" || v === "0") return Number(v) as StatusNum
  if (v === true) return 1
  if (v === false) return 0
  const s = typeof v === "string" ? v.toLowerCase() : ""
  if (s === "aktif") return 1
  if (s === "taslak" || s === "draft") return 2
  if (s === "pasif" || s === "inactive") return 0
  return 0
}

/** 0/1/2 durum kodunu "Pasif/Aktif/Taslak" etikete çevirir. */
export function statusLabel(n: unknown): "Aktif" | "Taslak" | "Pasif" {
  const v = toStatusNumber(n)
  return v === 1 ? "Aktif" : v === 2 ? "Taslak" : "Pasif"
}

/** Filter/dropdown için seçenekler (UI dostu). */
export const STATUS_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "active",  label: "Aktif",  num: 1 as StatusNum },
  { value: "draft",   label: "Taslak", num: 2 as StatusNum },
  { value: "passive", label: "Pasif",  num: 0 as StatusNum },
] as const

/** Seçenek tipi (component prop’larında kullanışlı) */
export type StatusOption = typeof STATUS_OPTIONS[number]

/** Kısa yol yardımcıları (UI görünürlüğü vb.) */
export function isActive(n: unknown)  { return toStatusNumber(n) === 1 }
export function isDraft(n: unknown)   { return toStatusNumber(n) === 2 }
export function isPassive(n: unknown) { return toStatusNumber(n) === 0 }
