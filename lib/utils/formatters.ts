/**
 * Format angka menjadi format mata uang Indonesia
 * @param amount - Jumlah uang
 * @returns String format mata uang Indonesia
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format tanggal menjadi format Indonesia
 * @param dateString - String tanggal
 * @returns String format tanggal Indonesia
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  return new Date(dateString).toLocaleDateString("id-ID", options)
}

/**
 * Format tanggal dan waktu menjadi format Indonesia
 * @param dateString - String tanggal
 * @returns String format tanggal dan waktu Indonesia
 */
export function formatDateTime(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  return new Date(dateString).toLocaleDateString("id-ID", options)
}

/**
 * Format jam dari string waktu
 * @param timeString - String waktu format HH:MM
 * @returns String format jam Indonesia
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`
} 