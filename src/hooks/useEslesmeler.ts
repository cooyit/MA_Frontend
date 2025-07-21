// -----------------------------------------------------------------------------
//  useEslesmeler.ts
//  Katman: React - Hook
//  Amaç:
//   Bu dosya, eşleşme verilerini API'den çekmek için özel bir React Hook tanımlar.
//   `useEslesmeler` hook'u, filtreye göre eşleşme verilerini alır, loading & error
//   durumlarını yönetir ve bu verileri bileşenlere sunar.
// -----------------------------------------------------------------------------

import { useEffect, useState, useCallback } from 'react';
import { EslesmeFilterDto, EslesmeListDto } from '@/types';
import { getEslesmelerFiltered } from '@/services/api';

export function useEslesmeler(filter: EslesmeFilterDto) {
  const [data, setData] = useState<EslesmeListDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEslesmeler = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getEslesmelerFiltered(filter);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError('Veri alınırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    fetchEslesmeler();
  }, [fetchEslesmeler]);

  return {
    data,
    loading,
    error,
    refetch: fetchEslesmeler, // dışarıya refetch fonksiyonu da açılır
  };
}
