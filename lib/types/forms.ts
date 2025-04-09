import { StatusMotor } from './enums'
import { MotorcycleType } from './motorcycle'

export interface AvailabilitySearchParams {
  tanggalMulai: string
  tanggalSelesai: string
  jamMulai: string
  jamSelesai: string
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

export interface BackendUnitAvailability {
  unitId: string
  platNomor: string
  jenisMotor: {
    id: string
    merk: string
    model: string
    cc: number
  }
  hargaSewa: number
  status: StatusMotor
  availability: {
    date: string
    isAvailable: boolean
  }[]
}

export interface AvailabilityResponse {
  startDate: string
  endDate: string
  totalUnits: number
  units: BackendUnitAvailability[]
} 