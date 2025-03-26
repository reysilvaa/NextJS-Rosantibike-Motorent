import type {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  MotorcycleType,
  MotorcycleUnit,
  Transaction,
  BlogPost,
  AvailabilitySearchParams,
  TransactionFormData,
  AvailabilityResponse
} from "./types"
import { API_CONFIG, getAuthHeader } from "./api-config"
import { responseInterceptor, errorInterceptor } from "./api-interceptor"

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
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorResponse = {
        ...errorData,
        status: response.status,
        statusText: response.statusText,
        message: errorData.message || `API request failed with status ${response.status}`
      }
      return errorInterceptor(errorResponse, endpoint)
    }

    const responseData = await response.json()
    
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
    console.error(`Error during API request to ${endpoint}:`, error)
    return errorInterceptor(error, endpoint)
  }
}

// Authentication API
export async function login(username: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

// Motorcycle Types API
export async function fetchMotorcycleTypes(search?: string): Promise<MotorcycleType[]> {
  const endpoint = search 
    ? `${API_CONFIG.ENDPOINTS.JENIS_MOTOR}?search=${encodeURIComponent(search)}` 
    : API_CONFIG.ENDPOINTS.JENIS_MOTOR
  const response = await apiRequest<ApiResponse<MotorcycleType[]>>(endpoint)
  return Array.isArray(response) ? response : response.data || []
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
        queryParams.append(key, String(value))
      }
    })
    
    const queryString = queryParams.toString()
    if (queryString) {
      endpoint += `?${queryString}`
    }
  }
  
  const response = await apiRequest<ApiResponse<MotorcycleUnit[]>>(endpoint)
  return Array.isArray(response) ? response : response.data || []
}

export async function fetchMotorcycleUnitById(id: string): Promise<MotorcycleUnit> {
  const response = await apiRequest<ApiResponse<MotorcycleUnit>>(`${API_CONFIG.ENDPOINTS.UNIT_MOTOR}/${id}`)
  return response.data
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
    
    console.log(`Making request to: ${endpoint}`);
    
    const response = await apiRequest<AvailabilityResponse>(endpoint);
    
    // Log respons untuk debug
    console.log("Availability API response:", response);
    
    let result: MotorcycleUnit[] = [];
    
    // Validasi hasil API
    if (response && response.units && Array.isArray(response.units)) {
      result = response.units;
      
      // Simpan hasil ke cache
      availabilityCache[cacheKey] = {
        data: result,
        timestamp: now
      };
    } else {
      console.warn("Invalid API response format:", response);
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
  const response = await apiRequest<ApiResponse<Transaction>>(API_CONFIG.ENDPOINTS.TRANSAKSI, {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.data
}

export async function completeTransaction(id: string): Promise<Transaction> {
  const response = await apiRequest<ApiResponse<Transaction>>(`${API_CONFIG.ENDPOINTS.TRANSAKSI}/${id}/selesai`, {
    method: "POST",
  })
  return response.data
}

// Blog API
export async function fetchBlogPosts(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  kategori?: string,
): Promise<BlogPost[]> {
  const queryParams = new URLSearchParams()
  queryParams.append("page", page.toString())
  queryParams.append("limit", limit.toString())
  if (search) queryParams.append("search", search)
  if (status) queryParams.append("status", status)
  if (kategori) queryParams.append("kategori", kategori)

  const response = await apiRequest<PaginatedResponse<BlogPost>>(`${API_CONFIG.ENDPOINTS.BLOG}?${queryParams.toString()}`)
  return Array.isArray(response) ? response : response.data || []
}

export async function fetchBlogPostById(id: string): Promise<BlogPost> {
  const response = await apiRequest<ApiResponse<BlogPost>>(`${API_CONFIG.ENDPOINTS.BLOG}/${id}`)
  return response.data
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await apiRequest<PaginatedResponse<BlogPost>>(`${API_CONFIG.ENDPOINTS.BLOG}?slug=${encodeURIComponent(slug)}`)
    if (Array.isArray(response)) {
      const post = response.length > 0 ? response.find((post) => post.slug === slug) : null
      return post || null
    }
    const post = response.data && response.data.length > 0 ? response.data.find((post) => post.slug === slug) : null
    return post || null
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return null
  }
}

