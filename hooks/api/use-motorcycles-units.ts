import { useState, useEffect, useCallback } from 'react';
import { fetchMotorcycleUnits } from '@/lib/api';
import { useLoading } from '../ui/use-loading';
import type { MotorcycleUnit } from '@/lib/types';

/**
 * Hook untuk mengambil daftar unit sepeda motor
 * @param filters - Filter untuk pencarian unit sepeda motor
 * @returns Data unit sepeda motor, status loading, error, dan fungsi refetch
 */
export function useMotorcycleUnits(filters?: Record<string, any>) {
  const [data, setData] = useState<MotorcycleUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await withLoading(fetchMotorcycleUnits(filters));
      setData(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat unit motor');
      setData([]);
    }
  }, [filters, withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
} 