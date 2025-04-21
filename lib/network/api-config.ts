// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  API_TIMEOUT: 60000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  ENDPOINTS: {
    AUTH_LOGIN: '/auth/login',
    JENIS_MOTOR: '/jenis-motor',
    UNIT_MOTOR: '/unit-motor',
    UNIT_MOTOR_AVAILABILITY: '/unit-motor/availability',
    TRANSAKSI: '/transaksi',
    TRANSAKSI_HISTORY: '/transaksi/history',
    TRANSAKSI_USER: '/transaksi/user',
    TRANSAKSI_SEARCH: '/transaksi/search',
    BLOG: '/blog',
  },
};

// Helper to get authentication header
export function getAuthHeader(): Record<string, string> {
  const headers: Record<string, string> = {};

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}
