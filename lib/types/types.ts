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

// Motorcycle Types
export interface MotorcycleType {
  id: string
  merk: string
  model: string
  cc: number
  tahun?: number
  year?: number
  deskripsi?: string
  gambar: string | null
  imageUrl?: string | null
  status?: "available" | "rented" | "maintenance"
  pricePerDay?: number
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
    gambar?: string | null
  }
  createdAt?: string
  updatedAt?: string
  availability?: {
    date: string
    isAvailable: boolean
  }[]
  jenisId?: string
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
  jamMulai?: string
  jamSelesai?: string
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
  featuredImage?: string
  status: "draft" | "published"
  thumbnail?: string
  kategori: string
  tags?: string[]
  meta_description?: string
  createdAt: string
  updatedAt?: string
  
  // Tambahan field untuk tampilan detail blog
  author?: string
  tanggal_publikasi?: string
  reading_time?: number
  related_posts?: {
    judul: string
    slug: string
    thumbnail?: string
    tanggal_publikasi?: string
  }[]
}

// Form Types
export interface AvailabilitySearchParams {
  tanggalMulai: string
  tanggalSelesai: string
  jenisMotorId?: string
}

export interface TransactionFormData {
  namaPenyewa: string
  noWhatsapp: string
  unitId: string
  tanggalMulai: string
  tanggalSelesai: string
  jamMulai: string
  jamSelesai: string
  jasHujan?: number
  helm?: number
  totalBiaya?: number
  // Mempertahankan properti frontend untuk backward compatibility
  namaCustomer?: string
  noHP?: string
  alamat?: string
  nomorKTP?: string
  unitMotorId?: string
}

// Tipe untuk respons endpoint availability asli dari backend
export interface BackendUnitAvailability {
  unitId: string
  platNomor: string
  jenisMotor: {
    id: string
    merk: string
    model: string
    cc: number
  }
  hargaSewa: number | string
  status: "TERSEDIA" | "DISEWA" | "SERVIS" | "OVERDUE"
  availability: {
    date: string
    isAvailable: boolean
  }[]
}

// Response untuk availability check
export interface AvailabilityResponse {
  startDate: string
  endDate: string
  totalUnits: number
  units: BackendUnitAvailability[]
}

