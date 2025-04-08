import { useState, useEffect, useCallback } from 'react';
import { fetchMotorcycleTypes, fetchMotorcycleUnits, checkAvailability as apiCheckAvailability } from '@/lib/network/api';
import { useLoading } from './common/use-loading';
import { toast } from './common/use-toast';
import { MotorcycleType, MotorcycleUnit, AvailabilitySearchParams } from '@/lib/types';
import { API_CONFIG } from '@/lib/network/api-config';
import { MotorcycleFilters } from '@/contexts/motorcycle-filter-context';

// Fungsi utility untuk konversi filter ke parameter API
function convertFiltersToApiParams(filters?: Partial<MotorcycleFilters>): Record<string, any> | undefined {
  if (!filters) return undefined;
  
  const params: Record<string, any> = {};
  
  // Menangani filter pencarian
  if (filters.search) {
    params.search = filters.search;
  }
  
  // Menangani filter rentang CC - pastikan nilai adalah number
  if (filters.ccRange && filters.ccRange.length === 2) {
    // Hanya tambahkan filter jika nilai tidak sama dengan default
    if (filters.ccRange[0] > 0 || filters.ccRange[1] < 1500) {
      params.ccMin = Number(filters.ccRange[0]);
      params.ccMax = Number(filters.ccRange[1]);
      console.log(`CC filter active: ${params.ccMin}-${params.ccMax}`);
    }
  }
  
  // Menangani filter tahun - pastikan nilai adalah number
  if (filters.yearRange && filters.yearRange.length === 2) {
    const currentYear = new Date().getFullYear();
    // Hanya tambahkan filter jika nilai tidak sama dengan default
    if (filters.yearRange[0] > 2010 || filters.yearRange[1] < currentYear) {
      params.yearMin = Number(filters.yearRange[0]);
      params.yearMax = Number(filters.yearRange[1]);
      console.log(`Year filter active: ${params.yearMin}-${params.yearMax}`);
    }
  }
  
  // Menangani filter brand/merek - pastikan dikirim sebagai array
  if (filters.brands && filters.brands.length > 0) {
    // Gunakan parameter brands dengan array
    params.brands = filters.brands;
    console.log(`Brand filter active: ${params.brands.join(', ')}`);
  }
  
  console.log('Filter params yang dikirim ke API:', params);
  
  return Object.keys(params).length > 0 ? params : undefined;
}

export function useMotorcycleTypes(filters?: Partial<MotorcycleFilters>) {
  const [data, setData] = useState<MotorcycleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const [retryCount, setRetryCount] = useState(0);
  const [disabledFilters, setDisabledFilters] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      // Konversi filter ke parameter API
      const apiParams = convertFiltersToApiParams(filters);
      
      // Hapus filter yang tidak didukung berdasarkan percobaan sebelumnya
      if (apiParams && disabledFilters.length > 0) {
        disabledFilters.forEach(filterName => {
          if (apiParams[filterName]) {
            console.log(`Menghapus filter yang tidak didukung: ${filterName}`);
            delete apiParams[filterName];
          }
        });
      }
      
      // Log untuk debugging
      console.log("Fetching motorcycle units with params:", apiParams);
      
      // Panggil API unit-motor (bukan jenis-motor) dengan parameter filter
      const result = await withLoading(fetchMotorcycleUnits(apiParams));
      
      // Transformasi data unit-motor ke format jenis-motor
      const motorcycleTypes = result.reduce((acc: MotorcycleType[], unit) => {
        // Ambil data jenis dari unit
        if (unit.jenis && !acc.some(item => item.id === unit.jenis.id)) {
          acc.push({
            id: unit.jenis.id,
            merk: unit.jenis.merk,
            model: unit.jenis.model,
            slug: unit.jenis.slug || `${unit.jenis.merk}-${unit.jenis.model}`.toLowerCase().replace(/\s+/g, '-'),
            cc: unit.jenis.cc || 0,
            gambar: unit.jenis.gambar || null,
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
            unitMotor: [unit]
          });
        }
        return acc;
      }, []);
      
      setData(motorcycleTypes);
      setError(null);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching data:", err);
      
      // Cek jika error berkaitan dengan kolom yang tidak ada
      if (err.message && err.message.includes('Unknown argument') && retryCount < 2) {
        setRetryCount(prevCount => prevCount + 1);
        
        // Deteksi filter yang menyebabkan masalah
        const errorMessage = err.message;
        const unknownArgMatch = errorMessage.match(/Unknown argument `([^`]+)`/);
        
        if (unknownArgMatch && unknownArgMatch[1]) {
          const problematicFilter = unknownArgMatch[1];
          console.warn(`Filter ${problematicFilter} tidak didukung, mencoba kembali tanpa filter ini`);
          
          // Tambahkan ke daftar filter yang dinonaktifkan
          setDisabledFilters(prev => {
            if (!prev.includes(problematicFilter)) {
              return [...prev, problematicFilter];
            }
            return prev;
          });
          
          // Tunggu sebentar lalu coba kembali
          setTimeout(() => {
            console.log("Mencoba kembali fetching data tanpa filter yang bermasalah");
            fetchData();
          }, 500);
          
          return;
        }
      }
      
      setError(err.message || 'Gagal memuat jenis motor');
      setData([]);
    }
  }, [filters, withLoading, disabledFilters, retryCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch, disabledFilters };
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