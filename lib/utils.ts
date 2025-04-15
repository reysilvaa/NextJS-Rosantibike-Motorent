import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fungsi untuk mengoptimalkan URL gambar
export function getOptimizedImageUrl(url: string, width = 0, height = 0, quality = 80) {
  // Deteksi jika URL sudah merupakan URL Cloudinary atau URL lain yang dioptimalkan
  if (url.includes('res.cloudinary.com')) {
    // Pisahkan URL untuk mendapatkan path image
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Tambahkan parameter optimasi Cloudinary
      const transformations = `c_fill,w_${width || 'auto'},h_${height || 'auto'},q_${quality},f_auto`;
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
  }
  
  // Untuk URL gambar lainnya, kembalikan URL asli
  return url;
} 