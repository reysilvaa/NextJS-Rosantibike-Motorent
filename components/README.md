# Components

Folder ini berisi semua komponen React yang digunakan dalam aplikasi Rental Motor. Komponen diorganisasi berdasarkan fungsi dan domain untuk memudahkan pemeliharaan dan pengembangan.

## Struktur Folder

Komponen telah diatur menjadi beberapa kategori logis:

1. **layout/** - Komponen untuk layout aplikasi
   - `navbar.tsx` - Navigasi utama
   - `footer.tsx` - Footer aplikasi
   - `theme-provider.tsx` - Provider untuk tema aplikasi

2. **ui/** - Komponen UI dasar dan reusable
   - Komponen dasar seperti button, card, dialog, dll

3. **utils/** - Komponen utilitas
   - `language-switcher.tsx` - Selector bahasa
   - `theme-toggle.tsx` - Toggle mode terang/gelap

4. **home/** - Komponen khusus untuk halaman beranda
   - `home.tsx` - Komponen utama beranda
   
5. **map/** - Komponen terkait peta
   - `google-map.tsx` - Komponen integrasi Google Maps

6. **motorcycles/** - Komponen terkait motor
   - Daftar, detail, dan filter motor

7. **availability/** - Komponen terkait ketersediaan
   - `availability-preview.tsx` - Preview ketersediaan motor

8. **blog/** - Komponen terkait blog
   - Daftar, detail, dan kategori blog

9. **contact/** - Komponen untuk halaman kontak
   - Form kontak dan informasi kontak

10. **features/** - Komponen untuk fitur utama aplikasi
    - Fitur-fitur utama yang ditonjolkan

11. **reports/** - Komponen untuk laporan
    - Form dan visualisasi laporan

12. **shared/** - Komponen yang digunakan di banyak tempat
    - Komponen yang digunakan di berbagai bagian aplikasi

13. **core/** - Komponen inti aplikasi
    - Komponen-komponen fundamental

## Penggunaan

Komponen dapat diimpor dari file indeks utama:

```tsx
import { Navbar, Footer, ThemeToggle } from "@/components";
```

Atau diimpor langsung dari folder spesifik:

```tsx
import { Navbar } from "@/components/layout/navbar";
```

## Praktik Terbaik

1. Pastikan setiap komponen memiliki satu tanggung jawab
2. Gunakan TypeScript untuk definisi props
3. Kelompokkan komponen terkait dalam folder yang sama
4. Buat dokumentasi untuk props dan fungsi komponen kompleks
5. Gunakan komponen UI dasar dari folder `ui/` sebanyak mungkin
6. Jangan duplikasi fungsionalitas antar komponen 