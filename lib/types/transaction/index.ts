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

// Form transaksi
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

// Tipe untuk hasil perhitungan harga
export interface RentalPriceCalculation {
  totalBiaya: number
  durasi: {
    totalHours: number
    fullDays: number
    extraHours: number
  }
  biaya: {
    dasar: number
    jasHujan: number
    helm: number
  }
  rincian: {
    hargaPerJam: number
    hargaPerHari: number
  }
} 