import axios from 'axios'
import { API_CONFIG, getAuthHeader } from './config'

/**
 * Axios instance untuk API calls
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.API_TIMEOUT || 30000,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: false,
  maxRedirects: 5,
  maxContentLength: 50 * 1000 * 1000, // 50 MB
  proxy: false
});

// Tambahkan interceptor untuk menangani token
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      config.headers.Authorization = authHeader.Authorization;
    }
    
    // Log untuk debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Axios Request] ${config.method?.toUpperCase() || 'GET'} ${config.url}`, { 
        baseURL: config.baseURL,
        timeout: config.timeout
      });
    }
    
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
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Axios Response] ${response.config.method?.toUpperCase() || 'GET'} ${response.config.url}`, { 
        status: response.status, 
        data: response.data 
      });
    }
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
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 