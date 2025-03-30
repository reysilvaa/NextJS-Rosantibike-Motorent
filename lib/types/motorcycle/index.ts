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

// Form Types
export interface AvailabilitySearchParams {
  tanggalMulai: string
  tanggalSelesai: string
  jenisMotorId?: string
}

// Response untuk availability check
export interface AvailabilityResponse {
  startDate: string
  endDate: string
  totalUnits: number
  units: BackendUnitAvailability[]
} 