// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    totalItems: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

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

// Motorcycle Types
export interface MotorcycleType {
  id: string
  merk: string
  model: string
  cc: number
  tahun?: number
  deskripsi?: string
  gambar: string | null
  createdAt?: string
  updatedAt?: string
  unitMotor?: MotorcycleUnit[]
}

export interface MotorcycleUnit {
  id: string
  platNomor: string
  warna?: string
  hargaSewa: number
  status: "TERSEDIA" | "DISEWA" | "SERVIS" | "OVERDUE"
  jenis: {
    id: string
    merk: string
    model: string
    cc?: number
    gambar?: string
  }
  createdAt?: string
  updatedAt?: string
  availability?: {
    date: string
    isAvailable: boolean
  }[]
}

// Transaction Types
export interface Transaction {
  id: string
  namaCustomer: string
  noHP: string
  alamat: string
  nomorKTP: string
  tanggalMulai: string
  tanggalSelesai: string
  status: "AKTIF" | "SELESAI" | "DIBATALKAN" | "OVERDUE"
  totalBiaya: number
  unitMotor: {
    id: string
    platNomor: string
    jenis: {
      merk: string
      model: string
    }
  }
  createdAt?: string
  updatedAt?: string
}

// Blog Types
export interface BlogPost {
  id: string
  judul: string
  slug: string
  konten: string
  featuredImage: string
  status: "draft" | "published"
  thumbnail?: string;
  kategori: string
  tags?: string[]
  meta_description?: string
  createdAt: string
  updatedAt?: string
}

// Form Types
export interface AvailabilitySearchParams {
  tanggalMulai: string
  tanggalSelesai: string
  jenisMotorId?: string
}

export interface TransactionFormData {
  namaCustomer: string
  noHP: string
  alamat: string
  nomorKTP: string
  tanggalMulai: string
  tanggalSelesai: string
  unitMotorId: string
}

// Response untuk availability check
export interface AvailabilityResponse {
  startDate: string
  endDate: string
  totalUnits: number
  units: MotorcycleUnit[]
}

