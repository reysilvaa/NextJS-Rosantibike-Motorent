// Authentication Types
export interface Admin {
  id: string
  username: string
  nama: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  access_token: string
  admin: Admin
} 