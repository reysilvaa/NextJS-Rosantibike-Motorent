/**
 * Validasi format nomor telepon Indonesia
 * @param phone - Nomor telepon
 * @returns Boolean apakah nomor telepon valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Format nomor telepon Indonesia: +62xxx / 08xxx (10-13 digit)
  const phoneRegex = /^(\+62|62|0)[8][0-9]{8,11}$/;
  return phoneRegex.test(phone);
}

/**
 * Validasi format email
 * @param email - Alamat email
 * @returns Boolean apakah email valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validasi format nomor KTP Indonesia (16 digit)
 * @param ktp - Nomor KTP
 * @returns Boolean apakah nomor KTP valid
 */
export function isValidKTP(ktp: string): boolean {
  // Format KTP: 16 digit angka
  const ktpRegex = /^[0-9]{16}$/;
  return ktpRegex.test(ktp);
}

/**
 * Validasi apakah string kosong
 * @param value - String yang akan dicek
 * @returns Boolean apakah string kosong
 */
export function isEmpty(value?: string): boolean {
  return !value || value.trim() === '';
}

/**
 * Validasi apakah string memiliki panjang minimum
 * @param value - String yang akan dicek
 * @param minLength - Panjang minimum
 * @returns Boolean apakah string memenuhi panjang minimum
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Validasi apakah nilai numerik berada dalam range
 * @param value - Nilai numerik
 * @param min - Nilai minimum
 * @param max - Nilai maksimum
 * @returns Boolean apakah nilai dalam range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
} 