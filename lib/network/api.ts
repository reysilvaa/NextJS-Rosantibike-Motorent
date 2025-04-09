import type {
  ApiResponse,
  PaginatedResponse,
} from "../types/api"
import type {
  MotorcycleType,
  MotorcycleUnit
} from "../types/motorcycle"
import type {
  Transaction
} from "../types/transaction"
import type {
  BlogPost
} from "../types/blog"
import type {
  AvailabilitySearchParams,
  TransactionFormData,
  AvailabilityResponse,
  BackendUnitAvailability
} from "../types/forms"
import { API_CONFIG, getAuthHeader } from "./api-config"
import { responseInterceptor, errorInterceptor } from "./api-interceptor"
import axios from 'axios';
import ENDPOINTS, { buildApiUrl } from './endpoint';

// Axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.API_TIMEOUT || 30000,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: false, // Matikan withCredentials untuk menghindari masalah CORS
  maxRedirects: 5, // Batasi jumlah maksimum redirect
  maxContentLength: 50 * 1000 * 1000, // 50 MB
  proxy: false // Nonaktifkan proxy
});

// Tambahkan interceptor untuk menangani token
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      // Gunakan cara assign property terpisah untuk menghindari error tipe
      config.headers.Authorization = authHeader.Authorization;
    }
    
    // Log untuk debugging
    console.log(`[Axios Request] ${config.method?.toUpperCase() || 'GET'} ${config.url}`, { 
      baseURL: config.baseURL,
      timeout: config.timeout
    });
    
    return config;
  },
  (error) => {
    console.error('[Axios Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani respons
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response] ${response.config.method?.toUpperCase() || 'GET'} ${response.config.url}`, { 
      status: response.status, 
      data: response.data 
    });
    return response;
  },
  (error) => {
    // Tangani error global di sini
    console.error('[Axios Response Error]', {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response
    });
    
    if (error.response?.status === 401) {
      // Token tidak valid, redirect ke halaman login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  // Default headers
  const headers: Record<string, string> = {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...getAuthHeader(),
    ...(options.headers as Record<string, string> || {})
  }

  console.log(`Requesting ${url} with method ${options.method || 'GET'}`)

  try {
    if (!API_CONFIG.BASE_URL) {
      console.error('API_CONFIG.BASE_URL tidak terdefinisi. Periksa konfigurasi .env');
      throw new Error('URL API tidak terkonfigurasi dengan benar. Harap periksa file .env');
    }

    // Implementasi retry logic
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: any = null;

    while (retryCount < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT || 30000);
        
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
            console.error("API Error Response:", errorData);
          } catch (parseError) {
            console.error("Error parsing error response:", parseError);
            errorData = { 
              message: `Respons tidak valid: ${response.statusText}`,
              status: response.status,
              statusText: response.statusText 
            };
          }
          
          const errorResponse = {
            ...errorData,
            status: response.status,
            statusText: response.statusText,
            message: errorData.message || `API request failed with status ${response.status}`
          }
          
          console.error(`API Error [${endpoint}]:`, errorResponse);
          return errorInterceptor(errorResponse, endpoint)
        }

        const responseData = await response.json().catch(error => {
          console.error(`Error parsing JSON for ${endpoint}:`, error);
          throw { message: 'Format respons tidak valid', originalError: error };
        });
        
        console.log(`API response for ${endpoint}:`, responseData)

        // Handle different response formats
        let result: any
        if (responseData && typeof responseData === 'object') {
          if (Array.isArray(responseData)) {
            result = responseData
          } else if ('data' in responseData) {
            result = responseData.data
          } else {
            result = responseData
          }
        } else {
          result = responseData
        }
        
        return responseInterceptor(result, endpoint)
      } catch (error) {
        lastError = error;
        retryCount++;
        
        // Jika error adalah karena timeout atau network error, coba lagi
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.warn(`Request timeout, retry attempt ${retryCount}/${maxRetries}`);
          continue;
        }
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.warn(`Network error, retry attempt ${retryCount}/${maxRetries}`);
          // Tunggu sebentar sebelum retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        
        // Untuk error lainnya, langsung throw
        throw error;
      }
    }
    
    // Jika sudah mencapai max retry
    console.error(`Error after ${maxRetries} retry attempts:`, lastError);
    
    // Specific handling for network-related errors
    if (lastError instanceof TypeError && lastError.message.includes('Failed to fetch')) {
      return errorInterceptor({
        message: `Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.`,
        originalError: lastError
      }, endpoint);
    }
    
    return errorInterceptor(lastError, endpoint)
  } catch (error) {
    console.error(`Error during API request to ${endpoint}:`, error)
    
    // Specific handling for network-related errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return errorInterceptor({
        message: `Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.`,
        originalError: error
      }, endpoint);
    }
    
    return errorInterceptor(error, endpoint)
  }
}


// Motorcycle Types API
export async function fetchMotorcycleTypes(search?: string, filters?: Record<string, any>): Promise<MotorcycleType[]> {
  let endpoint: string;
  
  if (search && !filters) {
    endpoint = ENDPOINTS.JENIS_MOTOR.SEARCH(search);
  } else if (filters) {
    // Merge search into filters if it exists
    const mergedFilters = search ? { ...filters, search } : filters;
    endpoint = ENDPOINTS.JENIS_MOTOR.WITH_FILTERS(mergedFilters);
  } else {
    endpoint = ENDPOINTS.JENIS_MOTOR.BASE;
  }
  
  // Logging untuk debug
  console.log("Fetching motorcycle types from endpoint:", endpoint);
  console.log("Search:", search, "Filters:", filters);
  
  const response = await apiClient.get(endpoint);
  return response.data.data || [];
}

export async function fetchMotorcycleTypeById(id: string): Promise<MotorcycleType | null> {
  if (!id) {
    console.error('fetchMotorcycleTypeById called without ID');
    return null;
  }
  
  const endpoint = ENDPOINTS.JENIS_MOTOR.DETAIL(id);
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching motorcycle type with ID ${id}:`, error);
    return null;
  }
}

// Motorcycle Units API
export async function fetchMotorcycleUnits(filter?: Record<string, any>): Promise<MotorcycleUnit[]> {
  const endpoint = filter 
    ? ENDPOINTS.UNIT_MOTOR.WITH_FILTERS(filter)
    : ENDPOINTS.UNIT_MOTOR.BASE;
  
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching motorcycle units:', error);
    return [];
  }
}

export async function fetchMotorcycleUnitById(id: string): Promise<MotorcycleUnit> {
  if (!id) {
    throw new Error('fetchMotorcycleUnitById called without ID');
  }
  
  const endpoint = ENDPOINTS.UNIT_MOTOR.DETAIL(id);
  const response = await apiClient.get(endpoint);
  
  // Handle different response formats
  if (!response.data.data && response.data) {
    return response.data;
  }
  
  return response.data.data;
}

// Cache untuk menyimpan hasil request availability
const availabilityCache: Record<string, { data: MotorcycleUnit[], timestamp: number }> = {};
const CACHE_TTL = 60000; // 1 menit cache time-to-live

export async function checkAvailability(params: AvailabilitySearchParams): Promise<MotorcycleUnit[]> {
  if (!params.tanggalMulai || !params.tanggalSelesai) {
    throw new Error('Start and end dates are required for availability check');
  }
  
  const endpoint = ENDPOINTS.UNIT_MOTOR.AVAILABILITY_WITH_PARAMS({
    tanggalMulai: params.tanggalMulai,
    tanggalSelesai: params.tanggalSelesai,
    jamMulai: params.jamMulai,
    jamSelesai: params.jamSelesai
  });
  
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data || [];
  } catch (error) {
    console.error('Error checking availability:', error);
    return [];
  }
}

// Transactions API
export async function fetchTransactions(filter?: Record<string, any>): Promise<Transaction[]> {
  const endpoint = filter 
    ? ENDPOINTS.TRANSAKSI.WITH_FILTERS(filter)
    : ENDPOINTS.TRANSAKSI.BASE;
  
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function fetchTransactionHistory(): Promise<Transaction[]> {
  const endpoint = ENDPOINTS.TRANSAKSI.HISTORY;
  const response = await apiClient.get(endpoint);
  return response.data.data || [];
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  const endpoint = ENDPOINTS.TRANSAKSI.DETAIL(id);
  const response = await apiClient.get(endpoint);
  return response.data.data;
}

export async function createTransaction(data: TransactionFormData): Promise<Transaction> {
  // Definisikan interface untuk data yang akan dikirim ke backend
  interface TransformedData {
    namaPenyewa: string;
    noWhatsapp: string;
    unitId: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jamMulai: string;
    jamSelesai: string;
    jasHujan: number;
    helm: number;
    totalBiaya?: number;
  }
  
  // Membuat objek data baru yang hanya berisi field yang ada di DTO backend
  const transformedData: TransformedData = {
    namaPenyewa: data.namaPenyewa || data.namaCustomer || '',
    noWhatsapp: data.noWhatsapp || data.noHP || '',
    unitId: data.unitId || data.unitMotorId || '',
    tanggalMulai: data.tanggalMulai,
    tanggalSelesai: data.tanggalSelesai,
    jamMulai: data.jamMulai || "08:00",
    jamSelesai: data.jamSelesai || "08:00",
    jasHujan: Number(data.jasHujan || 0),
    helm: Number(data.helm || 0)
  };
  
  // Tambahkan totalBiaya hanya jika ada nilainya
  if (data.totalBiaya) {
    transformedData.totalBiaya = Number(data.totalBiaya);
  }

  console.log("Data yang dikirim ke backend:", transformedData);

  const endpoint = ENDPOINTS.TRANSAKSI.BASE;
  const response = await apiClient.post(endpoint, transformedData);
  return response.data.data;
}

export async function completeTransaction(id: string): Promise<Transaction> {
  const endpoint = ENDPOINTS.TRANSAKSI.COMPLETE(id);
  const response = await apiClient.post(endpoint);
  return response.data.data;
}

export async function fetchUserTransactions(): Promise<Transaction[]> {
  const endpoint = ENDPOINTS.TRANSAKSI.BASE;
  const response = await apiClient.get(endpoint);
  return response.data.data || [];
}

export async function searchTransactionsByPhone(phoneNumber: string): Promise<Transaction[]> {
  const endpoint = ENDPOINTS.TRANSAKSI.SEARCH_BY_PHONE(phoneNumber);
  const response = await apiClient.get(endpoint);
  return response.data.data || [];
}

// Fungsi untuk menghitung harga sewa
export async function calculateRentalPrice(data: {
  unitId: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  jamMulai: string,
  jamSelesai: string,
  jasHujan?: number,
  helm?: number
}): Promise<{
  totalBiaya: number,
  durasi: {
    totalHours: number,
    fullDays: number,
    extraHours: number
  },
  biaya: {
    dasar: number,
    jasHujan: number,
    helm: number
  },
  rincian: {
    hargaPerJam: number,
    hargaPerHari: number
  }
}> {
  const endpoint = ENDPOINTS.TRANSAKSI.CALCULATE_PRICE;
  const response = await apiClient.post(endpoint, data);
  return response.data.data;
}

// Blog API
export async function fetchBlogPosts(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  kategori?: string,
): Promise<PaginatedResponse<BlogPost>> {
  const params = {
    page,
    limit,
    search,
    status,
    kategori
  };
  
  const endpoint = ENDPOINTS.BLOG.WITH_FILTERS(params);
  const response = await apiClient.get(endpoint);
  return response.data.data || [];
}

export async function fetchBlogPostById(id: string): Promise<BlogPost> {
  const endpoint = ENDPOINTS.BLOG.DETAIL(id);
  const response = await apiClient.get(endpoint);
  return response.data.data;
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const endpoint = ENDPOINTS.BLOG.SLUG(slug);
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

// Check motorcycle availability
export async function checkMotorcycleAvailability(data: {
  unitId: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  jamMulai: string,
  jamSelesai: string
}): Promise<boolean> {
  const endpoint = ENDPOINTS.UNIT_MOTOR.AVAILABILITY;
  try {
    const response = await apiClient.get(endpoint, { 
      params: { 
        ...data,
        unitId: data.unitId
      } 
    });
    
    // Jika ada data yang dikembalikan, berarti motor tersedia
    return response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0;
  } catch (error) {
    console.error('Error checking motorcycle availability:', error);
    return false;
  }
}

