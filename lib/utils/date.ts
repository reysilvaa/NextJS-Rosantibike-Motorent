/**
 * Menambahkan hari ke tanggal
 * @param date - Tanggal awal
 * @param days - Jumlah hari yang ditambahkan
 * @returns Tanggal baru
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Menghitung selisih hari antar tanggal
 * @param startDate - Tanggal awal
 * @param endDate - Tanggal akhir
 * @returns Jumlah hari
 */
export function getDaysBetween(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset waktu ke 00:00:00 untuk menghitung hari penuh
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const differenceMs = Math.abs(end.getTime() - start.getTime());
  return Math.round(differenceMs / millisecondsPerDay);
}

/**
 * Menghitung jumlah jam antara dua waktu
 * @param startDateTime - Tanggal dan waktu awal
 * @param endDateTime - Tanggal dan waktu akhir
 * @returns Jumlah jam
 */
export function getHoursBetween(startDateTime: Date, endDateTime: Date): number {
  const millisecondsPerHour = 1000 * 60 * 60;
  const differenceMs = Math.abs(endDateTime.getTime() - startDateTime.getTime());
  return differenceMs / millisecondsPerHour;
}

/**
 * Memformat tanggal ke format YYYY-MM-DD
 * @param date - Tanggal
 * @returns Format tanggal
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Memformat waktu ke format HH:MM
 * @param date - Tanggal dan waktu
 * @returns Format waktu
 */
export function formatTimeToHHMM(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Mengecek apakah tanggal lebih besar dari hari ini
 * @param date - Tanggal yang dicek
 * @returns Boolean apakah tanggal lebih besar dari hari ini
 */
export function isDateAfterToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date > today;
}

/**
 * Mengecek apakah tanggal dalam range tertentu
 * @param date - Tanggal yang dicek
 * @param startDate - Tanggal awal
 * @param endDate - Tanggal akhir
 * @returns Boolean apakah tanggal dalam range
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  date.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  return date >= startDate && date <= endDate;
} 