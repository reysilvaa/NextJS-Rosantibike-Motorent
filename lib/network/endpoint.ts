/**
 * API Endpoints for Rosantibike
 * This file contains all the API endpoints used in the application
 * Consolidated from backend controllers
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api';

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  // Jenis Motor endpoints
  JENIS_MOTOR: {
    BASE: '/jenis-motor',
    DETAIL: (id: string) => `/jenis-motor/${id}`,
    SLUG: (slug: string) => `/jenis-motor/slug/${slug}`,
    SEARCH: (query: string) => `/jenis-motor?search=${encodeURIComponent(query)}`,
    WITH_FILTERS: (filters: Record<string, any>) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
      return `/jenis-motor?${params.toString()}`;
    }
  },

  // Unit Motor endpoints
  UNIT_MOTOR: {
    BASE: '/unit-motor',
    DETAIL: (id: string) => `/unit-motor/${id}`,
    SLUG: (slug: string) => `/unit-motor/slug/${slug}`,
    BRANDS: '/unit-motor/brands',
    AVAILABILITY: '/unit-motor/availability',
    AVAILABILITY_WITH_PARAMS: (params: {
      tanggalMulai: string,
      tanggalSelesai: string,
      jamMulai: string,
      jamSelesai: string
    }) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      return `/unit-motor/availability?${queryParams.toString()}`;
    },
    WITH_FILTERS: (filters: Record<string, any>) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
      return `/unit-motor?${params.toString()}`;
    }
  },

  // Transaksi endpoints
  TRANSAKSI: {
    BASE: '/transaksi',
    DETAIL: (id: string) => `/transaksi/${id}`,
    HISTORY: '/transaksi/history',
    SEARCH_BY_PHONE: (phone: string) => `/transaksi/search?noHP=${encodeURIComponent(phone)}`,
    COMPLETE: (id: string) => `/transaksi/${id}/selesai`,
    CALCULATE_PRICE: '/transaksi/calculate-price',
    LAPORAN: {
      DENDA: (startDate: string, endDate: string) => 
        `/transaksi/laporan/denda?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
      FASILITAS: (startDate: string, endDate: string) => 
        `/transaksi/laporan/fasilitas?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    },
    WITH_FILTERS: (filters: Record<string, any>) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
      return `/transaksi?${params.toString()}`;
    }
  },

  // Blog endpoints
  BLOG: {
    BASE: '/blog',
    DETAIL: (id: string) => `/blog/${id}`,
    SLUG: (slug: string) => `/blog/slug/${slug}`,
    CATEGORIES: '/blog/categories',
    WITH_FILTERS: (params: {
      page?: number,
      limit?: number,
      search?: string,
      status?: string,
      kategori?: string
    }) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      return `/blog?${queryParams.toString()}`;
    }
  },

  // WhatsApp endpoints
  WHATSAPP: {
    BASE: '/whatsapp',
    SEND: '/whatsapp/send',
    STATUS: '/whatsapp/status'
  },

  // Admin endpoints
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    STATISTICS: '/admin/statistics'
  }
};

/**
 * Helper function to build a complete API URL
 * @param endpoint The API endpoint
 * @returns Full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export default ENDPOINTS; 