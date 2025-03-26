import { toast } from "@/hooks/use-toast"

// Interceptor untuk mengelola respons API
export const responseInterceptor = (response: any, endpoint: string): any => {
  // Log untuk debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`API Response [${endpoint}]:`, response)
  }
  
  return response
}

// Interceptor untuk mengelola error API
export const errorInterceptor = (error: any, endpoint: string): never => {
  // Log error
  console.error(`API Error [${endpoint}]:`, error)
  
  // Handle empty error object
  if (!error || (typeof error === 'object' && Object.keys(error).length === 0)) {
    error = { message: `Koneksi ke server gagal atau server tidak merespons untuk ${endpoint}` };
  }
  
  // Extract validation errors
  let errorMessage = '';
  if (error?.status === 400 && error?.message && Array.isArray(error.message)) {
    // Handle validation errors (usually array of messages)
    errorMessage = error.message.slice(0, 2).join('; ');
    if (error.message.length > 2) {
      errorMessage += `; dan ${error.message.length - 2} kesalahan lainnya`;
    }
  } else {
    // Regular error message
    errorMessage = error?.message || error?.error || 'Terjadi kesalahan pada server';
  }
  
  // Tampilkan toast error
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })
  
  // Tangani error autentikasi
  if (error?.status === 401) {
    // Hapus token
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("admin_data")
      
      // Redirect ke halaman login jika tidak di halaman login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
  }
  
  throw error
} 