import { useState, useEffect, useCallback } from 'react';
import { fetchMotorcycleTypes, fetchMotorcycleUnits, checkAvailability } from '@/lib/api';
import { useLoading } from './use-loading';
import { toast } from './use-toast';
import type { MotorcycleType, MotorcycleUnit, AvailabilitySearchParams } from '@/lib/types';

export function useMotorcycleTypes(search?: string) {
  const [data, setData] = useState<MotorcycleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await withLoading(fetchMotorcycleTypes(search));
      setData(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat jenis motor');
      setData([]);
    }
  }, [search, withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

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

export function useAvailability(params: AvailabilitySearchParams | null) {
  const [data, setData] = useState<MotorcycleUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(false);
  
  // Tambah state untuk melacak timestamp request terakhir
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const THROTTLE_DELAY = 1000; // 1 detik delay antara request

  const fetchData = useCallback(async () => {
    if (!params) return;
    
    // Cek jika belum cukup waktu sejak request terakhir
    const now = Date.now();
    if (now - lastRequestTime < THROTTLE_DELAY) {
      console.log('Request ditunda karena terlalu cepat setelah request sebelumnya');
      return;
    }
    
    try {
      console.log('Checking availability with params:', params);
      
      // Update timestamp request
      setLastRequestTime(now);
      
      const result = await withLoading(checkAvailability(params));
      
      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.warn('API returned non-array result:', result);
        setData([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error checking availability:', err);
      if (err?.message?.includes('too many request')) {
        setError('Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.');
      } else {
        setError(err?.message || 'Gagal memeriksa ketersediaan motor');
      }
      setData([]);
    }
  }, [params, withLoading, lastRequestTime]);

  useEffect(() => {
    if (params) {
      // Gunakan timeout untuk debounce request
      const timer = setTimeout(() => {
        fetchData();
      }, 300); // Delay 300ms untuk menunggu parameter stabil
      
      return () => clearTimeout(timer);
    } else {
      setData([]);
    }
  }, [params, fetchData]);

  const refetch = useCallback(() => {
    // Cek throttle saat refetch manual
    const now = Date.now();
    if (now - lastRequestTime < THROTTLE_DELAY) {
      console.log('Refetch ditunda karena terlalu cepat setelah request sebelumnya');
      setTimeout(fetchData, THROTTLE_DELAY);
    } else {
      fetchData();
    }
  }, [fetchData, lastRequestTime]);

  return { data, isLoading, error, refetch };
} 