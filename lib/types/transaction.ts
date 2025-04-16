import { StatusTransaksi } from './enums';
import { MotorcycleUnit } from './motorcycle';

export interface Transaction {
  id: string;
  namaPenyewa: string;
  noWhatsapp: string;
  unitId: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: StatusTransaksi;
  totalBiaya: number; // Decimal in backend, but number in frontend for simplicity
  biayaDenda: number; // Decimal in backend, but number in frontend for simplicity
  helm: number;
  jamMulai: string;
  jamSelesai: string;
  jasHujan: number;
  unitMotor: MotorcycleUnit;
  createdAt: string;
  updatedAt: string;
}
