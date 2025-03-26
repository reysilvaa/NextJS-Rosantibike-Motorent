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
  
  // Tampilkan toast error
  const errorMessage = error?.message || 'Terjadi kesalahan pada server'
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