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
  // Buat objek URLSearchParams untuk query
  const queryParams = new URLSearchParams();
  
  // Tambahkan parameter search
  if (search) {
    queryParams.append('search', search);
  }
  
  // Tambahkan parameter filter tambahan dari filters
  if (filters && typeof filters === 'object') {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Khusus untuk brands yang berupa array
        if (key === 'brands' && Array.isArray(value)) {
          value.forEach((brand) => queryParams.append('brands', brand));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }
  
  // Buat endpoint dengan query params
  const queryString = queryParams.toString();
  const endpoint = `${API_CONFIG.ENDPOINTS.JENIS_MOTOR}${queryString ? `?${queryString}` : ''}`;
  
  // Logging untuk debug
  console.log("Fetching motorcycle types from endpoint:", endpoint);
  console.log("Search:", search, "Filters:", filters);

  try {
    const response = await apiRequest<ApiResponse<MotorcycleType[]>>(endpoint);
    const result = Array.isArray(response) ? response : response.data || [];
    
    console.log(`Fetched ${result.length} motorcycle types`);
    return result;
  } catch (error) {
    console.error("Error fetching motorcycle types:", error);
    throw error;
  }
}

export async function fetchMotorcycleTypeById(id: string): Promise<MotorcycleType | null> {
  try {
    // Di endpoint ini, API langsung mengembalikan data tanpa membungkusnya dalam properti 'data'
    const response = await apiRequest<MotorcycleType>(`${API_CONFIG.ENDPOINTS.JENIS_MOTOR}/${id}`)
    
    // Log respons untuk debugging
    console.log('Motorcycle type response:', response)
    
    // Periksa apakah respons valid
    if (!response) return null
    
    // Kembalikan data motor
    return response
  } catch (error) {
    console.error(`Error fetching motorcycle type by ID ${id}:`, error)
    return null
  }
}

// Motorcycle Units API
export async function fetchMotorcycleUnits(filter?: Record<string, any>): Promise<MotorcycleUnit[]> {
  let endpoint = API_CONFIG.ENDPOINTS.UNIT_MOTOR
  
  if (filter) {
    const queryParams = new URLSearchParams()
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Khusus untuk brands yang berupa array
        if (key === 'brands' && Array.isArray(value)) {
          // Coba cara lain untuk mengirim parameter array:
          // Menggunakan parameter terpisah untuk setiap nilai array
          value.forEach((brand) => queryParams.append('brands', brand));
        } else {
          queryParams.append(key, String(value))
        }
      }
    })
    
    const queryString = queryParams.toString()
    if (queryString) {
      endpoint += `?${queryString}`
    }
  }
  
  // Log for debugging
  console.log("Fetching motorcycle units from endpoint:", endpoint);
  
  try {
    const response = await apiRequest<ApiResponse<MotorcycleUnit[]>>(endpoint)
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error("Error fetching motorcycle units:", error);
    // Tambahkan detail lengkap error ke log
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function fetchMotorcycleUnitById(id: string): Promise<MotorcycleUnit> {
  try {
    // Validasi ID sebelum melakukan request
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      console.error('Invalid motorcycle ID:', id);
      throw new Error('ID motor tidak valid');
    }
    
    // Validasi format UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.error('ID motor tidak dalam format UUID yang valid:', id);
      throw new Error('Format ID motor tidak valid');
    }

    console.log(`Fetching motorcycle unit with ID: ${id}`);
    const response = await apiRequest<ApiResponse<MotorcycleUnit>>(`${API_CONFIG.ENDPOINTS.UNIT_MOTOR}/${id}`);
    
    // Log respons untuk debugging
    console.log('Motorcycle unit response:', response);
    
    // Cek apakah response adalah objek dan memiliki data
    if (!response) {
      console.error('Empty response from API');
      throw new Error('Data motor tidak ditemukan');
    }
    
    // Jika respons langsung berupa objek motor (bukan dalam property data)
    if (!response.data && typeof response === 'object' && 'id' in response) {
      return response as unknown as MotorcycleUnit;
    }
    
    if (!response.data) {
      console.error('No data property in response:', response);
      throw new Error('Data motor tidak ditemukan');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching motorcycle unit by ID ${id}:`, error);
    throw error;
  }
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
    queryParams.append("startDate", startDate.toISOString().split('T')[0]); // Hanya ambil bagian tanggal (YYYY-MM-DD)
    queryParams.append("endDate", endDate.toISOString().split('T')[0]);
    
    if (params.jenisMotorId) {
      queryParams.append("jenisId", params.jenisMotorId)
      console.log("Filtering by motorcycle type ID:", params.jenisMotorId);
    }
    
    const endpoint = `${API_CONFIG.ENDPOINTS.UNIT_MOTOR}/availability?${queryParams.toString()}`;
    
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
      const availabilityResponse = await apiRequest<AvailabilityResponse>(endpoint);
      console.log("Availability API response:", availabilityResponse);
      
      // Sesuai dengan format backend, response harus memiliki property 'units'
      if (availabilityResponse && typeof availabilityResponse === 'object' && 'units' in availabilityResponse) {
        // Extract data dari response format backend
        const units = availabilityResponse.units;
        
        // Filter motor yang benar-benar tersedia pada semua hari di rentang waktu yang diminta
        const availableUnits = units.filter((unit: BackendUnitAvailability) => {
          // Filter berdasarkan status motor
          if (unit.status !== "TERSEDIA" && unit.status !== "DIPESAN") {
            return false;
          }
          
          // Periksa ketersediaan pada semua hari dalam rentang
          if (!unit.availability || !Array.isArray(unit.availability)) {
            return false;
          }
          
          // Motor hanya tersedia jika semua hari dalam rentang tersedia
          const allDaysAvailable = unit.availability.every(day => day.isAvailable);
          return allDaysAvailable;
        });
        
        console.log(`Filtered ${availableUnits.length} available units out of ${units.length} total units`);
        
        // Transformasi ke format yang diharapkan frontend, dengan memastikan
        // bahwa motor dikembalikan dalam format yang konsisten
        const result: MotorcycleUnit[] = availableUnits.map((unit: BackendUnitAvailability) => {
          // Pastikan semua field yang dibutuhkan ada
          return {
            id: unit.unitId,
            platNomor: unit.platNomor,
            status: unit.status,
            hargaSewa: typeof unit.hargaSewa === 'string' ? parseInt(unit.hargaSewa) : unit.hargaSewa,
            jenis: unit.jenisMotor ? {
              id: unit.jenisMotor.id,
              merk: unit.jenisMotor.merk || "",
              model: unit.jenisMotor.model || "",
              cc: unit.jenisMotor.cc || 0,
              gambar: null,
              slug: (unit.jenisMotor.merk + "-" + unit.jenisMotor.model).toLowerCase().replace(/\s+/g, '-'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            } : {
              id: "", 
              merk: "Motor", 
              model: unit.platNomor,
              cc: 0,
              gambar: null,
              slug: ("generic-motor-" + unit.platNomor).toLowerCase().replace(/\s+/g, '-'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            jenisId: unit.jenisMotor?.id || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slug: unit.platNomor.replace(/\s+/g, '-').toLowerCase(),
            tahunPembuatan: new Date().getFullYear(),
            warna: "Tidak tersedia"
          };
        });
        
        // Simpan ke cache
        availabilityCache[cacheKey] = {
          data: result,
          timestamp: now
        };
        
        console.log(`Returning ${result.length} transformed units from availability endpoint`);
        return result;
      } else if (Array.isArray(availabilityResponse)) {
        // Jika response adalah array langsung
        const result = (availabilityResponse as MotorcycleUnit[]).filter(unit => unit.status === "TERSEDIA");
        
        // Simpan ke cache
        availabilityCache[cacheKey] = {
          data: result,
          timestamp: now
        };
        
        console.log(`Returning ${result.length} units as direct array from availability endpoint`);
        return result;
      }
      
      // Jika format tidak sesuai, gunakan endpoint alternatif
      console.warn("Invalid response format from availability endpoint, using alternative endpoint");
    } catch (error) {
      console.error("Error fetching from availability endpoint:", error);
    }
    
    // Gunakan endpoint unit-motor biasa sebagai fallback
    console.log("Using unit-motor endpoint as fallback");
    const alternativeResponse = await apiRequest<ApiResponse<MotorcycleUnit[]> | MotorcycleUnit[]>(API_CONFIG.ENDPOINTS.UNIT_MOTOR);
    
    console.log("Alternative endpoint response:", alternativeResponse);
    
    let result: MotorcycleUnit[] = [];
    
    if (Array.isArray(alternativeResponse)) {
      // Filter hanya motor yang tersedia
      result = alternativeResponse.filter(unit => unit.status === "TERSEDIA");
    } else if (alternativeResponse && typeof alternativeResponse === 'object') {
      // Cast ke tipe yang sesuai
      const typedResponse = alternativeResponse as unknown as { data?: MotorcycleUnit[] };
      if (typedResponse.data && Array.isArray(typedResponse.data)) {
        result = typedResponse.data.filter((unit: MotorcycleUnit) => unit.status === "TERSEDIA");
      }
    }
    
    // Simpan hasil ke cache
    if (result.length > 0) {
      console.log(`Caching ${result.length} motorcycles from alternative endpoint`);
      availabilityCache[cacheKey] = {
        data: result,
        timestamp: now
      };
    }
    
    return result;
  } catch (error: any) {
    console.error('Error checking motorcycle availability:', error);
    
    // Handle throttle error spesifik
    if (error?.message?.includes('too many request')) {
      console.warn('Request dibatasi oleh server (throttled)');
      throw new Error('Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.');
    }
    
    return []; // Selalu kembalikan array kosong jika terjadi error lain
  }
}

// Transactions API
export async function fetchTransactions(filter?: Record<string, any>): Promise<Transaction[]> {
  let endpoint = API_CONFIG.ENDPOINTS.TRANSAKSI
  
  if (filter) {
    const queryParams = new URLSearchParams()
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })
    
    const queryString = queryParams.toString()
    if (queryString) {
      endpoint += `?${queryString}`
    }
  }
  
  const response = await apiRequest<ApiResponse<Transaction[]>>(endpoint)
  return Array.isArray(response) ? response : response.data || []
}

export async function fetchTransactionHistory(): Promise<Transaction[]> {
  const response = await apiRequest<ApiResponse<Transaction[]>>(API_CONFIG.ENDPOINTS.TRANSAKSI_HISTORY)
  return Array.isArray(response) ? response : response.data || []
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  const response = await apiRequest<ApiResponse<Transaction>>(`${API_CONFIG.ENDPOINTS.TRANSAKSI}/${id}`)
  return response.data
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

  const response = await apiRequest<ApiResponse<Transaction>>(API_CONFIG.ENDPOINTS.TRANSAKSI, {
    method: "POST",
    body: JSON.stringify(transformedData),
  })
  return response.data
}

export async function completeTransaction(id: string): Promise<Transaction> {
  const response = await apiRequest<ApiResponse<Transaction>>(`${API_CONFIG.ENDPOINTS.TRANSAKSI}/${id}/selesai`, {
    method: "POST",
  })
  return response.data
}

export async function fetchUserTransactions(): Promise<Transaction[]> {
  const response = await apiRequest<ApiResponse<Transaction[]>>(API_CONFIG.ENDPOINTS.TRANSAKSI_USER);
  return Array.isArray(response) ? response : response.data || [];
}

export async function searchTransactionsByPhone(phoneNumber: string): Promise<Transaction[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("noHP", phoneNumber);
  
  const endpoint = `${API_CONFIG.ENDPOINTS.TRANSAKSI_SEARCH}?${queryParams.toString()}`;
  const response = await apiRequest<ApiResponse<Transaction[]>>(endpoint);
  return Array.isArray(response) ? response : response.data || [];
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
  // Format data ke bentuk yang diexpect backend
  const requestData = {
    unitId: data.unitId,
    tanggalMulai: data.tanggalMulai,
    tanggalSelesai: data.tanggalSelesai,
    jamMulai: data.jamMulai || "08:00",
    jamSelesai: data.jamSelesai || "08:00",
    jasHujan: Number(data.jasHujan || 0),
    helm: Number(data.helm || 0)
  };

  try {
    console.log("Calculating rental price with data:", requestData);
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.TRANSAKSI}/calculate-price`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });
    
    console.log("Price calculation response:", response);
    return response;
  } catch (error) {
    console.error("Error calculating price:", error);
    // Return fallback calculation if API fails
    const startDate = new Date(data.tanggalMulai);
    const endDate = new Date(data.tanggalSelesai);
    const [jamMulaiHour, jamMulaiMinute] = data.jamMulai.split(':').map(Number);
    const [jamSelesaiHour, jamSelesaiMinute] = data.jamSelesai.split(':').map(Number);
    
    startDate.setHours(jamMulaiHour, jamMulaiMinute, 0, 0);
    endDate.setHours(jamSelesaiHour, jamSelesaiMinute, 0, 0);
    
    // Calculate hours difference
    const diffHours = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)));
    const fullDays = Math.floor(diffHours / 24);
    const extraHours = diffHours % 24;
    
    const hourlyRate = 15000;
    const dailyRate = hourlyRate * 24;
    const baseCost = (fullDays * dailyRate) + (extraHours * hourlyRate);
    const jasHujanCost = 5000 * Number(data.jasHujan || 0);
    const helmCost = 5000 * Number(data.helm || 0);
    
    return {
      totalBiaya: baseCost + jasHujanCost + helmCost,
      durasi: {
        totalHours: diffHours,
        fullDays,
        extraHours
      },
      biaya: {
        dasar: baseCost,
        jasHujan: jasHujanCost,
        helm: helmCost
      },
      rincian: {
        hargaPerJam: hourlyRate,
        hargaPerHari: dailyRate
      }
    };
  }
}

// Blog API
export async function fetchBlogPosts(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  kategori?: string,
): Promise<PaginatedResponse<BlogPost>> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())
    if (search) queryParams.append("search", search)
    if (status) queryParams.append("status", status)
    if (kategori) queryParams.append("kategori", kategori)

    console.log(`Requesting blog posts with params: page=${page}, limit=${limit}`);
    
    const endpoint = `${API_CONFIG.ENDPOINTS.BLOG}?${queryParams.toString()}`;
    const response = await apiClient.get<PaginatedResponse<BlogPost>>(endpoint);
    
    // Validasi respons
    if (!response || !response.data) {
      console.error('Empty response from blog API');
      throw new Error('Tidak ada respons dari server');
    }
    
    console.log('Blog posts response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function fetchBlogPostById(id: string): Promise<BlogPost> {
  const response = await apiRequest<ApiResponse<BlogPost>>(`${API_CONFIG.ENDPOINTS.BLOG}/${id}`)
  return response.data
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const endpoint = `${API_CONFIG.ENDPOINTS.BLOG}/by-slug/${slug}`;
    console.log(`Mencoba mengambil blog post dengan slug: ${slug}`);
    
    const response = await apiClient.get(endpoint);
    console.log('Data yang diterima dari API:', response.data);
    
    // Ekstrak data blog dari respons
    let blogPost: BlogPost | null = null;
    
    if (response.data && response.data.data) {
      // Jika data dibungkus dalam properti data (format API Response)
      blogPost = response.data.data;
    } else if (response.data) {
      // Jika langsung mendapatkan objek blog post
      blogPost = response.data;
    }
    
    // Pastikan data yang dikembalikan sesuai format BlogPost
    if (blogPost) {
      return {
        id: blogPost.id,
        judul: blogPost.judul,
        slug: blogPost.slug,
        konten: blogPost.konten,
        thumbnail: blogPost.thumbnail,
        featuredImage: blogPost.featuredImage || null,
        kategori: blogPost.kategori,
        status: blogPost.status as 'DRAFT' | 'TERBIT',
        createdAt: blogPost.createdAt,
        updatedAt: blogPost.updatedAt,
        tags: blogPost.tags || [],
        author: blogPost.author || undefined
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    // Jika terjadi error, kembalikan null daripada melempar error
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
  try {
    // Buat query parameters untuk endpoint availability
    const params = new URLSearchParams();
    
    // Format tanggal yang diterima API (YYYY-MM-DD)
    // Ubah format tanggal jika perlu
    const tanggalMulai = data.tanggalMulai.includes('T') 
      ? data.tanggalMulai.split('T')[0] 
      : data.tanggalMulai;
    
    const tanggalSelesai = data.tanggalSelesai.includes('T') 
      ? data.tanggalSelesai.split('T')[0] 
      : data.tanggalSelesai;
    
    params.append('startDate', tanggalMulai);
    params.append('endDate', tanggalSelesai);
    
    // Log untuk debugging
    console.log(`Checking availability for unit ${data.unitId} from ${tanggalMulai} to ${tanggalSelesai}`);
    
    // Gunakan endpoint availability yang sudah ada dengan request GET
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.UNIT_MOTOR}/availability?${params.toString()}`);
    
    console.log("Availability check response:", response);
    
    // Periksa apakah unit yang dicari tersedia pada rentang waktu tersebut
    if (response && response.units && Array.isArray(response.units)) {
      // Cari unit yang sesuai dengan unitId
      const unit = response.units.find((u: any) => u.unitId === data.unitId);
      
      if (!unit) {
        console.log(`Unit dengan ID ${data.unitId} tidak ditemukan dalam response`);
        return false;
      }
      
      console.log(`Found unit in response:`, unit);
      
      // Periksa apakah unit tersedia pada rentang tanggal tersebut
      if (unit.availability && Array.isArray(unit.availability)) {
        // Periksa apakah semua hari dalam rentang tersedia
        const allDaysAvailable = unit.availability.every((day: any) => day.isAvailable);
        console.log(`Unit availability check result: ${allDaysAvailable ? 'Available' : 'Not Available'}`);
        
        if (!allDaysAvailable) {
          // Log hari-hari yang tidak tersedia untuk debugging
          const unavailableDays = unit.availability
            .filter((day: any) => !day.isAvailable)
            .map((day: any) => day.date);
          console.log(`Unit tidak tersedia pada tanggal: ${unavailableDays.join(', ')}`);
        }
        
        return allDaysAvailable;
      }
    }
    
    // Jika response tidak sesuai format yang diharapkan
    console.log("Invalid response format or unit not found");
    return false;
  } catch (error) {
    console.error("Error checking motorcycle availability:", error);
    return false;
  }
}

