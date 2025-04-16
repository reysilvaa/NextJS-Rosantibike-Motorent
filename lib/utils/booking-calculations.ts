/**
 * Booking price calculation utilities
 */

import type { MotorcycleUnit } from '@/lib/types';

interface RentalParams {
  motorcycle: MotorcycleUnit;
  startDate: Date;
  endDate: Date;
  jamMulai: string;
  jamSelesai: string;
}

interface PriceBreakdown {
  totalDays: number;
  fullDays: number;
  extraHours: number;
  totalHours: number;
  isOverdue: boolean;
  baseDailyPrice: number;
  overduePrice: number;
  totalPrice: number;
  hargaSewaPerHari: number;
  dendaPerJam: number;
}

/**
 * Calculate rental price and return the breakdown
 */
export function calculateRentalPrice({
  motorcycle,
  startDate,
  endDate,
  jamMulai,
  jamSelesai,
}: RentalParams): PriceBreakdown {
  // Hitung durasi dalam hari kalender antara tanggal mulai dan selesai
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Hitung jam sewa dengan benar
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const [jamMulaiHour, jamMulaiMinute] = jamMulai.split(':').map(Number);
  const [jamSelesaiHour, jamSelesaiMinute] = jamSelesai.split(':').map(Number);

  startDateTime.setHours(jamMulaiHour, jamMulaiMinute, 0, 0);
  endDateTime.setHours(jamSelesaiHour, jamSelesaiMinute, 0, 0);

  // Hitung durasi dalam jam
  const totalHours = Math.max(
    1,
    Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60))
  );

  // Hitung jumlah hari penuh dan jam tambahan
  let fullDays = Math.floor(totalHours / 24);
  let extraHours = totalHours % 24;

  // Jika extra hours lebih dari 6 jam, tambahkan 1 hari penuh
  if (extraHours > 6) {
    fullDays += 1;
    extraHours = 0;
  }

  // Hitung tarif sewa langsung dari data motor
  const hargaSewaPerHari = motorcycle.hargaSewa;

  // Tarif keterlambatan (yang melebihi kelipatan 24 jam)
  const dendaPerJam = 15000;

  // Hitung biaya sewa
  const baseDailyPrice = fullDays * hargaSewaPerHari;
  const overduePrice = extraHours > 0 ? extraHours * dendaPerJam : 0;
  const totalPrice = baseDailyPrice + overduePrice;

  // Status keterlambatan
  const isOverdue = extraHours > 0;

  return {
    totalDays,
    fullDays,
    extraHours,
    totalHours,
    isOverdue,
    baseDailyPrice,
    overduePrice,
    totalPrice,
    hargaSewaPerHari,
    dendaPerJam,
  };
}

/**
 * Format duration text based on days and hours
 */
export function formatDuration(
  fullDays: number,
  extraHours: number,
  totalHours: number,
  _isOverdue: boolean
): string {
  let durationText = '';

  if (fullDays > 0) {
    durationText += `${fullDays} hari `;
  }

  if (extraHours > 0) {
    durationText += `${extraHours} jam`;
  } else if (fullDays > 0) {
    // If we have days but no extra hours, don't add anything
  } else {
    durationText = `${totalHours} jam`;
  }

  return durationText.trim();
}
