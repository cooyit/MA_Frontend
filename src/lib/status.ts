// src/lib/status.ts
/** @file Status yardımcıları: tek doğruluk noktası.
 *  API'den gelen 0/1/2, "0"/"1"/"2", true/false veya "Aktif/Taslak/Pasif" gibi
 *  değerleri normalize eder ve UI etiketleri/yardımcıları sağlar.
 */

export type StatusNum = 0 | 1 | 2;
export type StatusStr = "Pasif" | "Aktif" | "Taslak";

/** Liste/filtre kontrollerinde kullanılan değerler */
export type StatusFilter = "all" | "active" | "draft" | "passive";

/** Objeden aktif/Aktif/durum alanını okuyup normalize eder */
export function getStatus(obj: Record<string, any>): StatusNum {
  return toStatusNumber(
    obj?.aktif ??
      obj?.Aktif ??
      obj?.durum ??
      obj?.Durum ??
      obj?.status ??
      obj?.Status
  );
}

/** Verilen değeri (number/string/bool) 0/1/2 durum koduna çevirir. */
export function toStatusNumber(v: unknown): StatusNum {
  if (v === 1 || v === 2 || v === 0) return v;
  if (v === "1" || v === "2" || v === "0") return Number(v) as StatusNum;
  if (v === true) return 1;
  if (v === false) return 0;

  const s = typeof v === "string" ? v.toLowerCase() : "";
  if (s === "aktif" || s === "active") return 1;
  if (s === "taslak" || s === "draft") return 2;
  if (s === "pasif" || s === "inactive" || s === "passive") return 0;

  // Tanınmayanlar varsayılan olarak Pasif (0)
  return 0;
}

/** (İsteğe bağlı) Tanınmayan değerler için null döndüren varyant */
export function toStatusNumberOrNull(v: unknown): StatusNum | null {
  const s = typeof v === "string" ? v.toLowerCase() : v;
  if (s === 1 || s === "1" || s === true || s === "aktif" || s === "active") return 1;
  if (s === 2 || s === "2" || s === "taslak" || s === "draft") return 2;
  if (
    s === 0 ||
    s === "0" ||
    s === false ||
    s === "pasif" ||
    s === "inactive" ||
    s === "passive"
  )
    return 0;
  return null;
}

/** 0/1/2 durum kodunu "Pasif/Aktif/Taslak" etikete çevirir. */
export function statusLabel(n: unknown): StatusStr {
  const v = toStatusNumber(n);
  return v === 1 ? "Aktif" : v === 2 ? "Taslak" : "Pasif";
}

/** Filter/dropdown için seçenekler (UI dostu). */
export const STATUS_OPTIONS = [
  { value: "all",     label: "Tümü" },
  { value: "active",  label: "Aktif",  num: 1 as StatusNum },
  { value: "draft",   label: "Taslak", num: 2 as StatusNum },
  { value: "passive", label: "Pasif",  num: 0 as StatusNum },
] as const satisfies ReadonlyArray<{
  readonly value: StatusFilter;
  readonly label: string;
  readonly num?: StatusNum;
}>;

/** Seçenek tipi (component prop’larında kullanışlı) */
export type StatusOption = (typeof STATUS_OPTIONS)[number];

/** Kısa yol yardımcıları (UI görünürlüğü vb.) */
export function isActive(n: unknown)  { return toStatusNumber(n) === 1; }
export function isDraft(n: unknown)   { return toStatusNumber(n) === 2; }
export function isPassive(n: unknown) { return toStatusNumber(n) === 0; }

/** Filtre değerini predicate'e çevirir (liste filtreleme kolaylaşır). */
export function statusFilterPredicate(f: StatusFilter) {
  if (f === "all")     return (_: unknown) => true;
  if (f === "active")  return (n: unknown) => toStatusNumber(n) === 1;
  if (f === "draft")   return (n: unknown) => toStatusNumber(n) === 2;
  /* f === "passive" */return (n: unknown) => toStatusNumber(n) === 0;
}

/** (İsteğe bağlı) StatusNum → etiket map’i */
export const STATUS_NUM_LABEL: Record<StatusNum, StatusStr> = {
  0: "Pasif",
  1: "Aktif",
  2: "Taslak",
};

/** (İsteğe bağlı) StatusFilter → StatusNum eşlemesi (all → null) */
export function statusFilterToNum(f: StatusFilter): StatusNum | null {
  if (f === "active") return 1;
  if (f === "draft")  return 2;
  if (f === "passive")return 0;
  return null; // all
}
