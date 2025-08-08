// src/hooks/useDiller.ts
import * as React from "react";
import { getDiller, DilOption } from "@/services/dilService";

let _cache: DilOption[] | null = null; // çok basit bir modül cache

export function useDiller() {
  const [items, setItems] = React.useState<DilOption[]>(_cache ?? []);
  const [loading, setLoading] = React.useState<boolean>(_cache === null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (_cache) return; // cache varsa fetch etme
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await getDiller({ signal: ac.signal });
        _cache = list;
        setItems(list);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(String(e?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const refetch = React.useCallback(async () => {
    const ac = new AbortController();
    try {
      setLoading(true);
      setError(null);
      const list = await getDiller({ signal: ac.signal, cache: "no-store" });
      _cache = list;
      setItems(list);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, refetch };
}
