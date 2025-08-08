import { useEffect, useMemo, useState } from "react";
import { getModelNavigation, NavigationFilter, ModelNavigasyonDto } from "@/services/eslesmeService";

export function useEslesmeNavigation(filter: NavigationFilter) {
  const [data, setData] = useState<ModelNavigasyonDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0); // refresh tetikleyici

  const key = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    getModelNavigation(filter, { signal: ac.signal /* , cache: "no-store" */ })
      .then(d => { if (!ac.signal.aborted) setData(d); })
      .catch(e => { if (!ac.signal.aborted) setError((e as Error)?.message ?? String(e)); })
      .finally(() => { if (!ac.signal.aborted) setLoading(false); });

    return () => ac.abort();
  }, [key, nonce]);

  const refresh = () => setNonce(n => n + 1);

  return { data, loading, error, refresh };
}
