// src/pages/eslesme/Eslesme.tsx
"use client";

import { useState, useMemo, useCallback } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EslesmeSearchFilter } from "@/components/eslesme/EslesmeSearchFilter";
import { EslesmeTreeTable } from "@/components/eslesme/EslesmeTreeTable";

import { useEslesmeNavigation } from "@/hooks/useEslesmeNavigation";
import { toStatusNumber, statusLabel } from "@/lib/status";

import type {
  NavigationFilter,
  ModelNavigasyonDto,
} from "@/services/eslesmeService";

/* ----------------- API → Tree dönüştürücü ----------------- */
function normalizeToTree(models: ModelNavigasyonDto[]) {
  const num = (v: any): number | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const pick = <T,>(...vals: (T | null | undefined)[]) =>
    vals.find((v) => v !== undefined && v !== null) as T | undefined;

  const uniqBy = <T, K>(arr: T[], key: (x: T) => K) => {
    const seen = new Set<K>();
    const out: T[] = [];
    for (const it of arr ?? []) {
      const k = key(it);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(it);
      }
    }
    return out;
  };

  const dedupeBoyutlar = (raw: any[]) => {
    const map = new Map<number, any>();
    for (const b of raw ?? []) {
      const key = b.boyutId;
      if (!map.has(key)) {
        map.set(key, {
          ...b,
          kriterler: b.kriterler ? [...b.kriterler] : [],
          gostergeler: b.gostergeler ? [...b.gostergeler] : undefined,
        });
      } else {
        const tgt = map.get(key)!;
        const mergedK = [...(tgt.kriterler ?? []), ...(b.kriterler ?? [])];
        const mergedKUniq = uniqBy(mergedK, (k: any) => k.kriterId).map((k: any) => ({
          ...k,
          gostergeler: uniqBy(k.gostergeler ?? [], (g: any) => g.gostergeId),
        }));
        tgt.kriterler = mergedKUniq;

        const g1 = tgt.gostergeler ?? [];
        const g2 = b.gostergeler ?? [];
        const gMerged = uniqBy([...g1, ...g2], (g: any) => g.gostergeId);
        tgt.gostergeler = gMerged.length ? gMerged : undefined;
      }
    }

    for (const b of map.values()) {
      const kCount = b.kriterSayisi ?? (b.kriterler?.length ?? 0);
      const directG = b.gostergeler?.length ?? 0;
      const viaK =
        b.kriterler?.reduce((s: number, k: any) => s + (k.gostergeler?.length ?? 0), 0) ?? 0;
      b.kriterSayisi = kCount;
      b.gostergeSayisi = b.gostergeSayisi ?? directG + viaK;
    }

    return Array.from(map.values());
  };

  return (models ?? []).map((m: any) => {
    const mAktifRaw = pick((m as any).aktif, (m as any).Aktif);
    const boyutlarDedup = dedupeBoyutlar(m.boyutlar ?? []);

    const mBoyutSay =
      pick<number>(m.boyutSayisi as any, (m as any).BoyutSayisi) ?? boyutlarDedup.length;
    const mKriterSay =
      pick<number>(m.kriterSayisi as any, (m as any).KriterSayisi) ??
      boyutlarDedup.reduce(
        (acc: number, b: any) => acc + (b.kriterSayisi ?? b.kriterler?.length ?? 0),
        0
      );
    const mGostergeSay =
      pick<number>(m.gostergeSayisi as any, (m as any).GostergeSayisi) ??
      boyutlarDedup.reduce((acc: number, b: any) => {
        const direct = b.gostergeler?.length ?? 0;
        const viaK =
          b.kriterler?.reduce((a: number, k: any) => a + (k.gostergeler?.length ?? 0), 0) ?? 0;
        return acc + (b.gostergeSayisi ?? direct + viaK);
      }, 0);

    return {
      id: `m-${m.modelId}`,
      name: m.modelAdi,
      aktif: toStatusNumber(mAktifRaw),
      durum: statusLabel(mAktifRaw),
      type: "model" as const,
      boyutSayisi: mBoyutSay,
      kriterSayisi: mKriterSay,
      gostergeSayisi: mGostergeSay,

      boyutlar: (boyutlarDedup ?? []).map((b: any) => {
        const bAktifRaw = pick((b as any).aktif, (b as any).Aktif, mAktifRaw);
        const bKriterSay = b.kriterSayisi ?? b.kriterler?.length ?? 0;
        const bGostergeSay =
          b.gostergeSayisi ??
          ((b.gostergeler?.length ?? 0) +
            (b.kriterler?.reduce((a: number, k: any) => a + (k.gostergeler?.length ?? 0), 0) ?? 0));
        const bAg = pick<number>(
          (b as any).boyutIciAgirlik,
          (b as any).ModelIciAgirlik,
          (b as any).BoyutIciAgirlik
        );

        const base = {
          id: `b-${m.modelId}-${b.boyutId}`,
          name: b.boyutAdi,
          aktif: toStatusNumber(bAktifRaw),
          durum: statusLabel(bAktifRaw),
          type: "boyut" as const,
          kriterSayisi: bKriterSay,
          gostergeSayisi: bGostergeSay,
          boyutIciAgirlik: bAg,
        };

        const flat =
          m.hiyerarsi === true ||
          ((b.gostergeler?.length ?? 0) > 0 && (b.kriterler?.length ?? 0) === 0);

        if (flat) {
          const flatKey = `${b.boyutId}__flat`;
          return {
            ...base,
            kriterler: [
              {
                id: `k-${m.modelId}-${b.boyutId}-${flatKey}`,
                name: "",
                aktif: 0 as const,
                durum: "—",
                type: "kriter" as const,
                _virtual: true,
                gostergeSayisi: bGostergeSay,
                gostergeler: (b.gostergeler ?? []).map((g: any) => {
                  const gAktifRaw = pick(
                    (g as any).aktif,
                    (g as any).Aktif,
                    bAktifRaw,
                    mAktifRaw
                  );
                  return {
                    id: `g-${m.modelId}-${b.boyutId}-${flatKey}-${g.gostergeId}`,
                    name: g.gostergeAdi,
                    aktif: toStatusNumber(gAktifRaw),
                    durum: statusLabel(gAktifRaw),
                    type: "gosterge" as const,
                    modelIciAgirlik: num((g as any).modelIciAgirlik ?? (g as any).ModelIciAgirlik),
                    boyutIciAgirlik: num((g as any).boyutIciAgirlik ?? (g as any).BoyutIciAgirlik),
                    kriterIciAgirlik: num(
                      (g as any).kriterIciAgirlik ??
                        (g as any).Agirlik ??
                        (g as any).KriterIciAgirlik
                    ),
                  };
                }),
              },
            ],
          };
        }

        return {
          ...base,
          kriterler: (b.kriterler ?? []).map((k: any) => {
            const kAktifRaw = pick(
              (k as any).aktif,
              (k as any).Aktif,
              bAktifRaw,
              mAktifRaw
            );
            return {
              id: `k-${m.modelId}-${b.boyutId}-${k.kriterId}`,
              name: k.kriterAdi,
              aktif: toStatusNumber(kAktifRaw),
              durum: statusLabel(kAktifRaw),
              type: "kriter" as const,
              gostergeSayisi: k.gostergeSayisi ?? k.gostergeler?.length ?? 0,
              modelIciAgirlik: num((k as any).modelIciAgirlik ?? (k as any).ModelIciAgirlik),
              kriterIciAgirlik: num(
                (k as any).kriterIciAgirlik ??
                  (k as any).Agirlik ??
                  (k as any).KriterIciAgirlik
              ),
              gostergeler: (k.gostergeler ?? []).map((g: any) => {
                const gAktifRaw = pick(
                  (g as any).aktif,
                  (g as any).Aktif,
                  kAktifRaw,
                  bAktifRaw,
                  mAktifRaw
                );
                return {
                  id: `g-${m.modelId}-${b.boyutId}-${k.kriterId}-${g.gostergeId}`,
                  name: g.gostergeAdi,
                  aktif: toStatusNumber(gAktifRaw),
                  durum: statusLabel(gAktifRaw),
                  type: "gosterge" as const,
                  modelIciAgirlik: num((g as any).modelIciAgirlik ?? (g as any).ModelIciAgirlik),
                  boyutIciAgirlik: num((g as any).boyutIciAgirlik ?? (g as any).BoyutIciAgirlik),
                  kriterIciAgirlik: num(
                    (g as any).kriterIciAgirlik ??
                      (g as any).Agirlik ??
                      (g as any).KriterIciAgirlik
                  ),
                };
              }),
            };
          }),
        };
      }),
    };
  });
}

/* ----------------- Sayfa ----------------- */
export default function EslesmePage() {
  const [filter, setFilter] = useState<NavigationFilter>({})
  const [_resetKey] = useState(0)
  const { data, loading, error, refresh } = useEslesmeNavigation(filter)

  // ÖNEMLİ: kimliği sabit olsun
  const handleSearch = useCallback((f: NavigationFilter) => {
    setFilter(f)
  }, [])



  const hints = useMemo(() => {
    const set = <T,>(arr: T[]) => Array.from(new Set(arr));
  
    // isim anahtarları farklı (camelCase/PascalCase/snake_case) gelebileceği için güvenli isim seçici
    const nameOf = (obj: any, keys: string[]) => {
      for (const k of keys) {
        const v = obj?.[k];
        if (typeof v === "string" && v.trim().length > 0) return v.trim();
      }
      return "";
    };
  
    const models = set(
      (data ?? [])
        .map((m: any) => nameOf(m, ["modelAdi", "ModelAdi"]))
        .filter((s) => s.length > 0)
    );
  
    const boyutlar = set(
      (data ?? [])
        .flatMap((m: any) =>
          (m.boyutlar ?? []).map((b: any) => nameOf(b, ["boyutAdi", "BoyutAdi"]))
        )
        .filter((s) => s.length > 0)
    );
  
    const kriterler = set(
      (data ?? [])
        .flatMap((m: any) =>
          (m.boyutlar ?? []).flatMap((b: any) =>
            (b.kriterler ?? []).map((k: any) =>
              nameOf(k, ["kriterAdi", "KriterAdi", "kriter_adi"])
            )
          )
        )
        .filter((s) => s.length > 0)
    );
  
    const gostergeler = set(
      (data ?? [])
        .flatMap((m: any) =>
          (m.boyutlar ?? []).flatMap((b: any) => [
            ...(b.gostergeler ?? []).map((g: any) =>
              nameOf(g, ["gostergeAdi", "GostergeAdi"])
            ),
            ...(b.kriterler ?? []).flatMap((k: any) =>
              (k.gostergeler ?? []).map((g: any) =>
                nameOf(g, ["gostergeAdi", "GostergeAdi"])
              )
            ),
          ])
        )
        .filter((s) => s.length > 0)
    );
    
    
    return { model: models, boyut: boyutlar, kriter: kriterler, gosterge: gostergeler };
  }, [data]);
  

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">MODEL NAVİGASYONU</CardTitle>
          </CardHeader>
        </Card>

        <EslesmeSearchFilter
          onSearch={handleSearch}
          hints={hints}
          
          onRefresh={refresh}
        />

        <Card className="bg-card border-border">
          
          <CardContent className="p-0">
            {loading && <div className="p-4 text-muted-foreground">Yükleniyor...</div>}
            {error && <div className="p-4 text-destructive">{error}</div>}
            {!loading && !error && (
              <EslesmeTreeTable
                data={normalizeToTree(data)}
                onItemClick={(item, action) => console.log("Item action:", action, item)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}