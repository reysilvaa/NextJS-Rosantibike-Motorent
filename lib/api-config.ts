export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
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