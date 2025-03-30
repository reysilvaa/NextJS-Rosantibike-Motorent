import { useState, useEffect, useCallback } from 'react';
import { fetchMotorcycleTypes } from '@/lib/api';
import { useLoading } from '../ui/use-loading';
import type { MotorcycleType } from '@/lib/types';

/**
 * Fungsi utility untuk konversi filter ke parameter API
 * @param filters - Object filter untuk pencarian motorcycle types
 * @returns Parameter yang siap digunakan untuk API request
 */
function convertFiltersToApiParams(filters?: Partial<any>): Record<string, any> | undefined {
  if (!filters) return undefined;
  
  const params: Record<string, any> = {};
  
  // Menangani filter pencarian
  if (filters.search) {
    params.search = filters.search;
  }
  
  // Menangani filter rentang CC - pastikan nilai adalah number
  if (filters.ccRange && filters.ccRange.length === 2) {
    params.ccMin = Number(filters.ccRange[0]);
    params.ccMax = Number(filters.ccRange[1]);
  }
  
  // Menangani filter tahun - pastikan nilai adalah number
  if (filters.yearRange && filters.yearRange.length === 2) {
    params.yearMin = Number(filters.yearRange[0]);
    params.yearMax = Number(filters.yearRange[1]);
  }
  
  // Menangani filter brand/merek - pastikan dikirim sebagai array
  if (filters.brands && filters.brands.length > 0) {
    params.brands = filters.brands;
  }
  
  return Object.keys(params).length > 0 ? params : undefined;
}

/**
 * Hook untuk mengambil daftar tipe sepeda motor
 * @param filters - Filter untuk pencarian tipe sepeda motor
 * @returns Data tipe sepeda motor, status loading, error, filters yang tidak didukung, dan fungsi refetch
 */
export function useMotorcycleTypes(filters?: Partial<any>) {
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
      
      // Panggil API jenis-motor dengan parameter filter
      const result = await withLoading(fetchMotorcycleTypes(filters?.search, apiParams));
      
      setData(Array.isArray(result) ? result : []);
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