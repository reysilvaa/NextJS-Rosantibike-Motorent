'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { toast } from '@/hooks/common/use-toast'; // Pastikan path ini sesuai
import { apiClient } from '@/lib/network/api';

export interface MotorcycleFilters {
  search: string;
  ccMin: number;
  ccMax: number;
  yearMin: number;
  yearMax: number;
  brands: string[]; // ini sebenarnya adalah field 'merk' di model JenisMotor
  startDate?: string;
  endDate?: string;
  status?: string;
}

// Interface Brand mewakili data dari field 'merk' di model JenisMotor
interface Brand {
  id: string;
  merk: string;
}

interface MotorcycleFilterContextType {
  filters: MotorcycleFilters;
  setFilters: React.Dispatch<React.SetStateAction<MotorcycleFilters>>;
  updateFilter: <K extends keyof MotorcycleFilters>(key: K, value: MotorcycleFilters[K]) => void;
  resetFilters: () => void;
  availableBrands: Brand[];
  isLoading: boolean;
}

const defaultFilters: MotorcycleFilters = {
  search: '',
  ccMin: 0,
  ccMax: 1500,
  yearMin: 2010,
  yearMax: new Date().getFullYear(),
  brands: [],
};

// Data merek motor statis sebagai fallback
const staticBrands: Brand[] = [
  { id: 'honda', merk: 'Honda' },
  { id: 'yamaha', merk: 'Yamaha' },
  { id: 'suzuki', merk: 'Suzuki' },
  { id: 'kawasaki', merk: 'Kawasaki' },
  { id: 'vespa', merk: 'Vespa' },
  { id: 'harley', merk: 'Harley Davidson' },
  { id: 'ducati', merk: 'Ducati' },
  { id: 'bmw', merk: 'BMW' },
  { id: 'ktm', merk: 'KTM' },
];

const MotorcycleFilterContext = createContext<MotorcycleFilterContextType | undefined>(undefined);

export function MotorcycleFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<MotorcycleFilters>(defaultFilters);
  const [availableBrands, setAvailableBrands] = useState<Brand[]>(staticBrands);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        // Ambil merek-merek motor yang tersedia dari endpoint yang benar
        // Gunakan endpoint yang benar dan tambahkan timeout yang lebih panjang
        const brandsResponse = await apiClient.get('/unit-motor/brands', {
          timeout: 30000, // Tingkatkan timeout
          baseURL:
            typeof window !== 'undefined' && window.location.hostname === 'localhost'
              ? 'https://api.rosantibikemotorent.com'
              : undefined,
          headers: {
            'Content-Type': 'application/json',
          },
          // Tambahkan konfigurasi untuk mengatasi masalah CORS
          withCredentials: false,
          // Tambahkan retry dan timeout untuk axios
          maxRedirects: 5,
          maxContentLength: 50 * 1000 * 1000, // 50 MB
          // Proxy false di lingkungan tertentu
          proxy: false,
        });

        console.log('Brands response:', brandsResponse);

        if (brandsResponse?.data?.data) {
          setAvailableBrands(brandsResponse.data.data);
        } else if (brandsResponse?.data) {
          // Fallback jika strukturnya berbeda
          setAvailableBrands(brandsResponse.data);
        }
      } catch (error: any) {
        console.error('Error fetching brand options:', error);

        // Menampilkan pesan error yang lebih informatif
        if (error.code === 'ERR_NETWORK' || error.name === 'AxiosError') {
          console.warn('Network error, menggunakan data brands statis');
          // Tambahkan toast notification
          toast({
            title: 'Peringatan Koneksi',
            description: 'Tidak dapat terhubung ke server. Menggunakan data merek statis.',
            variant: 'default',
          });
          // Tetap gunakan data statis (sudah diinisialisasi di state)
        } else if (error.response) {
          // Error dari server dengan respons
          console.error('Server error:', error.response.status, error.response.data);
          toast({
            title: 'Error Server',
            description: `Server error: ${error.response.status}`,
            variant: 'destructive',
          });
        } else if (error.request) {
          // Error tanpa respons dari server
          console.error('No response from server');
          toast({
            title: 'Tidak Ada Respons',
            description: 'Server tidak merespons. Menggunakan data merek statis.',
            variant: 'default',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const updateFilter = <K extends keyof MotorcycleFilters>(key: K, value: MotorcycleFilters[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <MotorcycleFilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        availableBrands,
        isLoading,
      }}
    >
      {children}
    </MotorcycleFilterContext.Provider>
  );
}

export function useMotorcycleFilters() {
  const context = useContext(MotorcycleFilterContext);

  if (context === undefined) {
    throw new Error('useMotorcycleFilters must be used within a MotorcycleFilterProvider');
  }

  return context;
}
