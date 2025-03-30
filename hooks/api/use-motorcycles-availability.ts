import { useState, useEffect, useCallback } from 'react';
import { checkAvailability as apiCheckAvailability } from '@/lib/api';
import { useLoading } from '../ui/use-loading';
import type { MotorcycleUnit, AvailabilitySearchParams } from '@/lib/types';

// Cache untuk menyimpan hasil request availability
const availabilityCache: Record<string, { data: MotorcycleUnit[], timestamp: number }> = {};
const CACHE_TTL = 60000; // 1 menit cache time-to-live

/**
 * Fungsi untuk memeriksa ketersediaan sepeda motor
 * @param params - Parameter pencarian ketersediaan
 * @returns Daftar sepeda motor yang tersedia
 */
export async function checkAvailability(params: AvailabilitySearchParams): Promise<MotorcycleUnit[]> {
  try {
    // Membuat cache key dari parameter
    const cacheKey = JSON.stringify(params);
    
    // Cek cache sebelum melakukan request
    const cachedData = availabilityCache[cacheKey];
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      console.log('Menggunakan data cache untuk availability check');
      return cachedData.data;
    }
    
    // Jika tidak ada di cache, lakukan request
    const result = await apiCheckAvailability(params);
    
    // Simpan hasil ke cache
    availabilityCache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
}

/**
 * Hook untuk memeriksa ketersediaan sepeda motor
 * @param params - Parameter pencarian ketersediaan, null untuk tidak melakukan pencarian
 * @returns Data ketersediaan, status loading, error, dan fungsi refresh
 */
export function useAvailability(params: AvailabilitySearchParams | null) {
  const [data, setData] = useState<MotorcycleUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(false);
  
  const checkData = useCallback(async () => {
    if (!params) {
      setData([]);
      return;
    }
    
    try {
      const result = await withLoading(checkAvailability(params));
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memeriksa ketersediaan');
      setData([]);
    }
  }, [params, withLoading]);
  
  useEffect(() => {
    if (params) {
      checkData();
    } else {
      setData([]);
      setError(null);
    }
  }, [params, checkData]);
  
  const refresh = useCallback(() => {
    if (params) {
      checkData();
    }
  }, [params, checkData]);
  
  return { data, isLoading, error, refresh };
} 