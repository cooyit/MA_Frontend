// src/lib/fuzzy.ts
const TR_MAP: Record<string, string> = {
  İ:"i", I:"i", Ş:"s", Ğ:"g", Ü:"u", Ö:"o", Ç:"c",
  ı:"i", ş:"s", ğ:"g", ü:"u", ö:"o", ç:"c",
};

export function norm(s: string): string {
  return s
    .replace(/[İIŞĞÜÖÇışğüöç]/g, ch => TR_MAP[ch] ?? ch)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("tr"); // <-- burası!
}


/** Basit skorlayıcı – geriye dönük uyum: sadece text+score döner */
export function fuzzy(query: string, items: string[], limit = 12) {
  const q = norm(query).trim();
  if (!q) return items.slice(0, limit).map(t => ({ text: t, score: 0 }));
  const scored = items.map(text => {
    const n = norm(text);
    let score = -1;
    if (n.startsWith(q)) score = 100 - n.length;                           // prefix
    else if (n.split(/\s+/).some(w => w.startsWith(q))) score = 80 - n.length; // kelime başı
    else if (n.includes(q)) score = 50 - (n.indexOf(q) + n.length);
    return { text, score };
  }).filter(x => x.score >= 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, limit);
  return scored;
}

/** Yeni: highlight için eşleşme aralıklarını da döner */
export type FuzzyDetailed = {
  text: string;
  score: number;
  ranges: Array<[start: number, end: number]>; // [start, end) 0-based
};

export function fuzzyDetailed(query: string, items: string[], limit = 12): FuzzyDetailed[] {
  const q = norm(query).trim();
  const uniq = Array.from(new Set(items)); // dedup
  if (!q) return uniq.slice(0, limit).map(t => ({ text: t, score: 0, ranges: [] }));

  const results = uniq.map(text => {
    const n = norm(text);
    let score = -1;
    let ranges: Array<[number, number]> = [];

    if (n.startsWith(q)) {
      score = 100 - n.length;
      ranges = [[0, text.length >= q.length ? q.length : q.length]];
    } else {
      const words = n.split(/\s+/);
      const idx = n.indexOf(q);
      if (words.some(w => w.startsWith(q))) {
        score = 80 - n.length;
      } else if (idx >= 0) {
        score = 50 - (idx + n.length);
      }
      if (idx >= 0) {
        // norm ile orijinal arasındaki indeksler aynı olmayabilir ama NFKD sonrası Türkçe map’te uzunluk korunuyor.
        ranges = [[idx, idx + q.length]];
      }
    }

    return { text, score, ranges };
  })
  .filter(x => x.score >= 0)
  .sort((a,b) => b.score - a.score)
  .slice(0, limit);

  return results;
}
