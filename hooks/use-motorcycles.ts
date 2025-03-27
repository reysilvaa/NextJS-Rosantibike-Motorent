import { useState, useEffect, useCallback } from 'react';
import { fetchMotorcycleTypes, fetchMotorcycleUnits, checkAvailability as apiCheckAvailability } from '@/lib/api';
import { useLoading } from './use-loading';
import { toast } from './use-toast';
import type { MotorcycleType, MotorcycleUnit, AvailabilitySearchParams } from '@/lib/types';
import { API_CONFIG } from '@/lib/api-config';

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

// Cache untuk menyimpan hasil request availability
const availabilityCache: Record<string, { data: MotorcycleUnit[], timestamp: number }> = {};
const CACHE_TTL = 60000; // 1 menit cache time-to-live

export async function checkAvailability(params: AvailabilitySearchParams): Promise<MotorcycleUnit[]> {
  try {
    const queryParams = new URLSearchParams()
    
    // Log parameter untuk debugging
    console.log("Availability check parameters:", params);
    
    // Pastikan format tanggal adalah ISO 8601
    const startDate = new Date(params.tanggalMulai);
    const endDate = new Date(params.tanggalSelesai);
    
    // Format tanggal dalam ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
    queryParams.append("startDate", startDate.toISOString());
    queryParams.append("endDate", endDate.toISOString());
    
    if (params.jenisMotorId) {
      queryParams.append("jenisId", params.jenisMotorId)
      console.log("Filtering by motorcycle type ID:", params.jenisMotorId);
    }
    
    const endpoint = `${API_CONFIG.ENDPOINTS.UNIT_MOTOR_AVAILABILITY}?${queryParams.toString()}`;
    
    // Cek cache sebelum melakukan request
    const cacheKey = endpoint;
    const now = Date.now();
    const cachedData = availabilityCache[cacheKey];
    
    if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
      console.log("Returning cached availability data");
      return cachedData.data;
    }
    
    // Dapatkan data dari endpoint availability
    try {
      console.log(`Making request to: ${endpoint}`);
      const result = await fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          console.log('Availability result returned:', data);
          
          // Handle berbagai format respons
          if (Array.isArray(data)) {
            console.log(`Received array of ${data.length} motorcycles from API`);
            
            // Log detail untuk debugging
            if (data.length > 0) {
              console.log('Sample motor from availability:', data[0]);
            } else {
              console.log('No motorcycles returned from availability API');
            }
            
            return data;
          } else if (data && typeof data === 'object') {
            console.log('Received object result instead of array:', data);
            
            // Coba ekstrak data dari berbagai format yang mungkin
            // Cast result sebagai any untuk menghindari error typing
            const responseObj = data as any;
            
            if (responseObj.data && Array.isArray(responseObj.data)) {
              console.log(`Found ${responseObj.data.length} motorcycles in data property`);
              return responseObj.data;
            } else if (responseObj.units && Array.isArray(responseObj.units)) {
              console.log(`Found ${responseObj.units.length} motorcycles in units property`);
              return responseObj.units;
            } else if (responseObj.motorcycles && Array.isArray(responseObj.motorcycles)) {
              console.log(`Found ${responseObj.motorcycles.length} motorcycles in motorcycles property`);
              return responseObj.motorcycles;
            } else {
              console.warn('Could not find valid motorcycle array in response');
              return [];
            }
          } else {
            console.warn('API returned unknown result type:', data);
            return [];
          }
        })
        .catch(err => {
          console.error('Error checking availability:', err);
          if (err?.message?.includes('too many request')) {
            throw new Error('Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.');
          } else {
            throw new Error(err?.message || 'Gagal memeriksa ketersediaan motor');
          }
        });
      
      // Simpan hasil ke cache
      availabilityCache[cacheKey] = { data: result, timestamp: Date.now() };
      
      return result;
    } catch (err: any) {
      console.error('Error checking availability:', err);
      throw err;
    }
  } catch (err: any) {
    console.error('Error checking availability:', err);
    throw err;
  }
}

export function useAvailability(params: AvailabilitySearchParams | null) {
  const [data, setData] = useState<MotorcycleUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(false);
  
  // Tambah state untuk melacak timestamp request terakhir
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const THROTTLE_DELAY = 1000; // 1 detik delay antara request

  const fetchData = useCallback(async () => {
    if (!params) {
      console.log('No params provided, skipping availability check');
      return;
    }
    
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
      
      // Panggil API
      const result = await withLoading(apiCheckAvailability(params));
      
      console.log('Availability result returned:', result);
      
      // Handle berbagai format respons
      if (Array.isArray(result)) {
        console.log(`Received array of ${result.length} motorcycles from API`);
        
        // Log detail untuk debugging
        if (result.length > 0) {
          console.log('Sample motor from availability:', result[0]);
        } else {
          console.log('No motorcycles returned from availability API');
        }
        
        setData(result);
      } else if (result && typeof result === 'object') {
        console.log('Received object result instead of array:', result);
        
        // Coba ekstrak data dari berbagai format yang mungkin
        // Cast result sebagai any untuk menghindari error typing
        const responseObj = result as any;
        
        if (responseObj.data && Array.isArray(responseObj.data)) {
          console.log(`Found ${responseObj.data.length} motorcycles in data property`);
          setData(responseObj.data);
        } else if (responseObj.units && Array.isArray(responseObj.units)) {
          console.log(`Found ${responseObj.units.length} motorcycles in units property`);
          setData(responseObj.units);
        } else if (responseObj.motorcycles && Array.isArray(responseObj.motorcycles)) {
          console.log(`Found ${responseObj.motorcycles.length} motorcycles in motorcycles property`);
          setData(responseObj.motorcycles);
        } else {
          console.warn('Could not find valid motorcycle array in response');
          setData([]);
        }
      } else {
        console.warn('API returned unknown result type:', result);
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
      console.log('Params changed, preparing to fetch availability data');
      // Gunakan timeout untuk debounce request
      const timer = setTimeout(() => {
        fetchData();
      }, 300); // Delay 300ms untuk menunggu parameter stabil
      
      return () => clearTimeout(timer);
    } else {
      console.log('No params available, clearing data');
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
      console.log('Manually refetching availability data');
      fetchData();
    }
  }, [fetchData, lastRequestTime]);

  return { data, isLoading, error, refetch };
} 