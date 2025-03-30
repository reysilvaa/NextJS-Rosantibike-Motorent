export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  API_TIMEOUT: 30000, // 30 detik timeout
  ENDPOINTS: {
    // Auth
    AUTH_LOGIN: "/auth/login",
    
    // Motorcycle Types
    JENIS_MOTOR: "/jenis-motor",
    
    // Motorcycle Units
    UNIT_MOTOR: "/unit-motor",
    UNIT_MOTOR_AVAILABILITY: "/unit-motor/availability",
    
    // Transactions
    TRANSAKSI: "/transaksi",
    TRANSAKSI_HISTORY: "/transaksi/history",
    TRANSAKSI_USER: "/transaksi/user",
    TRANSAKSI_SEARCH: "/transaksi/search",
    
    // Blog
    BLOG: "/blog",
  },
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
}

export const getAuthHeader = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null
  return token ? { "Authorization": `Bearer ${token}` } : {}
}

// Helper untuk membuat full URL API
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG; 