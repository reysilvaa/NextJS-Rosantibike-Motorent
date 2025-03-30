"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth as useAuthHook } from "../api/use-auth"

interface User {
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

/**
 * Provider untuk autentikasi
 * @param children - React children nodes
 * @returns AuthProvider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { login: authLogin, logout: authLogout, getCurrentUser } = useAuthHook()

  useEffect(() => {
    // Coba membaca data user dari storage
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    
    setIsLoading(false)
  }, [getCurrentUser])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await authLogin(username, password)
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
    authLogout()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook untuk menggunakan AuthContext
 * @returns Auth context values
 * @throws Error jika digunakan di luar AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 