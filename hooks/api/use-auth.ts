import { useState, useCallback } from "react"
import { login as apiLogin } from "@/lib/api"
import type { Admin } from "@/lib/types"

/**
 * Interface untuk data user 
 */
interface User {
  id: string
  username: string
  nama: string
}

/**
 * Hook untuk autentikasi yang dapat digunakan di luar AuthProvider
 * @returns Fungsi login, status loading, dan error
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  /**
   * Fungsi untuk melakukan login
   * @param username - Username user
   * @param password - Password user
   * @returns Data user yang berhasil login
   */
  const login = useCallback(async (username: string, password: string): Promise<User> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiLogin(username, password)
      
      if (!response || !response.access_token) {
        throw new Error("Login gagal: Token tidak ditemukan dalam respons")
      }
      
      // Simpan token dan data user ke localStorage
      localStorage.setItem("auth_token", response.access_token)
      
      const userData: User = {
        id: response.admin.id,
        username: response.admin.username,
        nama: response.admin.nama,
      }
      
      localStorage.setItem("auth_user", JSON.stringify(userData))
      
      return userData
    } catch (error: any) {
      const errorMsg = error.message || "Login gagal"
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  /**
   * Fungsi untuk melakukan logout
   */
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }, [])
  
  /**
   * Fungsi untuk menentukan apakah user sudah login
   * @returns Boolean apakah user sudah login
   */
  const isAuthenticated = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem("auth_token")
  }, [])
  
  /**
   * Fungsi untuk mendapatkan data user saat ini
   * @returns Data user yang sedang login
   */
  const getCurrentUser = useCallback((): User | null => {
    if (typeof window === 'undefined') return null
    
    const userJson = localStorage.getItem("auth_user")
    if (!userJson) return null
    
    try {
      return JSON.parse(userJson)
    } catch (e) {
      console.error("Error parsing auth_user:", e)
      return null
    }
  }, [])

  return {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    isLoading,
    error
  }
} 