import { useCallback, useEffect, useState } from 'react';

import { MotorcycleFilters } from '@/contexts/motorcycle-filter-context';
import {
  checkAvailability as checkMotorcycleAvailability,
  fetchMotorcycleUnits as apiFetchMotorcycleUnits,
} from '@/lib/network/api';
import { API_CONFIG } from '@/lib/network/api-config';
import type { AvailabilitySearchParams, MotorcycleType, MotorcycleUnit } from '@/lib/types';

import { useLoading } from './common/use-loading';

// Fungsi utility untuk konversi filter ke parameter API
function convertFiltersToApiParams(
  filters?: Partial<MotorcycleFilters>
): Record<string, any> | undefined {
  if (!filters) return undefined;

  const params: Record<string, any> = {};

  // Menangani filter pencarian
  if (filters.search) {
    params.search = filters.search;
  }

  // Menangani filter CC (ccMin dan ccMax)
  if (typeof filters.ccMin === 'number') {
    params.ccMin = filters.ccMin;
  }
  
  if (typeof filters.ccMax === 'number') {
    params.ccMax = filters.ccMax;
  }

  // Menangani filter tahun (yearMin dan yearMax)
  if (typeof filters.yearMin === 'number') {
    params.yearMin = filters.yearMin;
  }
  
  if (typeof filters.yearMax === 'number') {
    params.yearMax = filters.yearMax;
  }

  // Menangani filter status
  if (filters.status) {
    params.status = filters.status;
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
      console.log('Fetching motorcycle units with params:', apiParams);

      // Panggil API unit-motor (bukan jenis-motor) dengan parameter filter
      const result = await withLoading(apiFetchMotorcycleUnits(apiParams));

      // Transformasi data unit-motor ke format jenis-motor
      const motorcycleTypes = result.reduce((acc: MotorcycleType[], unit) => {
        // Ambil data jenis dari unit
        if (unit.jenis && !acc.some(item => item.id === unit.jenis.id)) {
          acc.push({
            id: unit.jenis.id,
            merk: unit.jenis.merk,
            model: unit.jenis.model,
            slug:
              unit.jenis.slug ||
              `${unit.jenis.merk}-${unit.jenis.model}`.toLowerCase().replace(/\s+/g, '-'),
            cc: unit.jenis.cc || 0,
            gambar: unit.jenis.gambar || null,
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
            unitMotor: [unit],
          });
        }
        return acc;
      }, []);

      setData(motorcycleTypes);
      setError(null);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('Error fetching data:', err);

      // Cek jika error berkaitan dengan kolom yang tidak ada
      if (err.message && err.message.includes('Unknown argument') && retryCount < 2) {
        setRetryCount(prevCount => prevCount + 1);

        // Deteksi filter yang menyebabkan masalah
        const errorMessage = err.message;
        const unknownArgMatch = errorMessage.match(/Unknown argument `([^`]+)`/);

        if (unknownArgMatch && unknownArgMatch[1]) {
          const problematicFilter = unknownArgMatch[1];
          console.warn(
            `Filter ${problematicFilter} tidak didukung, mencoba kembali tanpa filter ini`
          );

          // Tambahkan ke daftar filter yang dinonaktifkan
          setDisabledFilters(prev => {
            if (!prev.includes(problematicFilter)) {
              return [...prev, problematicFilter];
            }
            return prev;
          });

          // Tunggu sebentar lalu coba kembali
          setTimeout(() => {
            console.log('Mencoba kembali fetching data tanpa filter yang bermasalah');
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
      const result = await withLoading(apiFetchMotorcycleUnits(filters));
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
const availabilityCache: Record<string, { data: MotorcycleUnit[]; timestamp: number }> = {};
const CACHE_TTL = 60000; // 1 menit cache time-to-live

export async function checkAvailability(
  params: AvailabilitySearchParams
): Promise<MotorcycleUnit[]> {
  try {
    const queryParams = new URLSearchParams();

    // Log parameter untuk debugging
    console.log('Availability check parameters:', params);

    // Format tanggal sesuai dengan yang diharapkan backend (YYYY-MM-DD)
    if (params.tanggalMulai) {
      const startDate = new Date(params.tanggalMulai);
      queryParams.append('startDate', startDate.toISOString().split('T')[0]);
    }

    if (params.tanggalSelesai) {
      const endDate = new Date(params.tanggalSelesai);
      queryParams.append('endDate', endDate.toISOString().split('T')[0]);
    }

    if (params.jenisMotorId) {
      queryParams.append('jenisId', params.jenisMotorId);
      console.log('Filtering by motorcycle type ID:', params.jenisMotorId);
    }

    const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNIT_MOTOR_AVAILABILITY}?${queryParams.toString()}`;

    // Cek cache sebelum melakukan request
    const cacheKey = endpoint;
    const now = Date.now();
    const cachedData = availabilityCache[cacheKey];

    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      console.log('Returning cached availability data');
      return cachedData.data;
    }

    // Dapatkan data dari endpoint availability
    try {
      console.log(`Making request to: ${endpoint}`);
      const result = await fetch(endpoint)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(responseData => {
          console.log('Availability result returned:', responseData);

          // Handle format respons dari backend baru
          if (responseData && responseData.data && responseData.data.units) {
            console.log(`Received ${responseData.data.units.length} units from API`);
            return responseData.data.units;
          } else if (Array.isArray(responseData)) {
            console.log(`Received array of ${responseData.length} motorcycles from API`);
            return responseData;
          } else if (responseData && responseData.data) {
            return responseData.data;
          } else {
            console.warn('Unexpected response format:', responseData);
            return [];
          }
        });

      // Cache hasil untuk request berikutnya
      availabilityCache[cacheKey] = {
        data: result,
        timestamp: now,
      };

      return result;
    } catch (error: any) {
      // Log error untuk debugging
      console.error('Error checking availability:', error);

      // Lempar error untuk ditangani oleh pemanggil
      throw error;
    }
  } catch (error: any) {
    console.error('Error in checkAvailability:', error);
    throw error;
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

      // Panggil API - Gunakan fungsi dari api.ts untuk memastikan logika filtering di satu tempat
      const result = await withLoading(checkMotorcycleAvailability(params));

      // API sudah mengembalikan array dengan format yang benar dan hanya yang tersedia
      console.log(`Received ${result.length} available motorcycles`);

      setData(result);
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
