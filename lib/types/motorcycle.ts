import { StatusMotor } from './enums';
import { Transaction } from './transaction';

export interface MotorcycleType {
  id: string;
  merk: string;
  model: string;
  slug: string;
  cc: number;
  gambar: string | null;
  createdAt: string;
  updatedAt: string;
  unitMotor?: MotorcycleUnit[];
}

export interface MotorcycleUnit {
  id: string;
  jenisId: string;
  platNomor: string;
  slug: string;
  status: StatusMotor;
  hargaSewa: number; // Decimal in backend, but number in frontend for simplicity
  tahunPembuatan: number;
  warna: string;
  createdAt: string;
  updatedAt: string;
  jenis: MotorcycleType;
  sewa?: Transaction[];
}
