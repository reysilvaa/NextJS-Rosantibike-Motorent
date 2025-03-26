"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { login as apiLogin } from "@/lib/api"
import { useLoading } from "./use-loading"
import { toast } from "./use-toast"
import type { Admin } from "@/lib/types"

interface AuthContextType {
  isAuthenticated: boolean
  admin: Admin | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const { isLoading, withLoading } = useLoading(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const adminData = localStorage.getItem("admin_data")

        if (token && adminData) {
          try {
            setAdmin(JSON.parse(adminData))
          } catch (error) {
            console.error("Gagal memuat data admin:", error)
            localStorage.removeItem("auth_token")
            localStorage.removeItem("admin_data")
          }
        }
      } finally {
        // Stop loading regardless of outcome
        // (Note: withLoading isn't used here because we just want to set loading state initially)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await withLoading(apiLogin(username, password))
        
        // Simpan data ke localStorage
        localStorage.setItem("auth_token", response.access_token)
        localStorage.setItem("admin_data", JSON.stringify(response.admin))
        
        // Update state
        setAdmin(response.admin)
        
        // Tampilkan notifikasi sukses
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${response.admin.nama}`,
        })
      } catch (error: any) {
        // Tampilkan error
        toast({
          title: "Login Gagal",
          description: error.message || "Username atau password salah",
          variant: "destructive",
        })
        throw error
      }
    },
    [withLoading]
  )

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("admin_data")
    setAdmin(null)
    
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!admin,
        admin,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

