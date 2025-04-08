"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { login as apiLogin } from "@/lib/network/api"
import { useRouter } from "next/navigation"
import type { Admin } from "@/lib/types/types"

interface User {
  name: any
  id: string
  username: string
  nama: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Coba membaca data user dari localStorage
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Error parsing stored user:", e)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
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
        name: response.admin.nama
      }
      
      localStorage.setItem("auth_user", JSON.stringify(userData))
      setUser(userData)
      
      // Redirect ke dashboard setelah login
      router.push("/admin")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
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

