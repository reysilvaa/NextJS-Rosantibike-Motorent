# Rosantibike Motorent Client Web - Aplikasi Rental Motor

## Terjemahan Multi-Bahasa (i18n)

Aplikasi ini mendukung multi-bahasa dengan menggunakan i18next. Berikut adalah panduan cara menerapkan terjemahan di komponen Anda:

### 1. Menggunakan Terjemahan di Komponen

```tsx
'use client';

import { useTranslation } from '@/i18n/hooks';

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcomeMessage')}</h1>
      <p>{t('someDescription')}</p>
    </div>
  );
}
```

### 2. Menambahkan Kunci Terjemahan Baru

Untuk menambahkan terjemahan baru:

1. Tambahkan kunci dan nilai terjemahan di file:

   - `/frontend/i18n/locales/id.json` untuk Bahasa Indonesia
   - `/frontend/i18n/locales/en.json` untuk Bahasa Inggris

2. Pastikan kunci yang sama ditambahkan ke kedua file

### 3. Terjemahan dengan Parameter

```tsx
// Contoh kunci terjemahan dengan parameter
// "welcome": "Halo, {name}!" (di id.json)
// "welcome": "Hello, {name}!" (di en.json)

const { t } = useTranslation();
const greeting = t('welcome', { name: 'John' }); // Hasil: "Hello, John!" atau "Halo, John!"
```

### 4. Perubahan Bahasa

Pengguna dapat mengubah bahasa menggunakan komponen `LanguageSwitcher`. Perubahan bahasa akan diterapkan secara instan ke seluruh aplikasi tanpa memerlukan refresh halaman.

### 5. Daftar Komponen yang Perlu Diterjemahkan

Pastikan Anda menerapkan terjemahan ke komponen-komponen berikut:

- [x] Navbar
- [x] Footer
- [x] ThemeToggle
- [x] LanguageSwitcher
- [x] Home/Hero
- [x] Home/FeaturedMotorcycles
- [x] Home/HowItWorks
- [x] Home/Testimonials
- [x] Home/BlogPreview
- [x] Home/ContactSection
- [x] Home/AvailabilityPreview
- [x] Motorcycles/List
- [x] Motorcycles/Detail
- [x] Availability/Calendar
- [x] Contact/Form
- [x] Blog/PostList
- [x] Blog/PostDetail

### 6. Cara Mengimplementasikan ke Komponen Yang Belum Diterjemahkan

1. Import hook `useTranslation`:

   ```tsx
   import { useTranslation } from '@/i18n/hooks';
   ```

2. Gunakan hook di komponen Anda:

   ```tsx
   const { t } = useTranslation();
   ```

3. Ganti semua string statis dengan fungsi `t()`:

   ```tsx
   // Sebelum:
   <h1>Judul Halaman</h1>

   // Sesudah:
   <h1>{t("pageTitle")}</h1>
   ```

4. Tambahkan kunci terjemahan ke file bahasa di `/frontend/i18n/locales/`

## Translation Status

### Components that need translation:

- [x] Home/HeroSection
- [x] Home/FeaturedMotorcycles
- [x] Home/HowItWorks
- [x] Home/Testimonials
- [x] Home/BlogPreview
- [x] Home/ContactSection
- [x] Home/AvailabilityPreview
- [x] Motorcycles/List
- [x] Motorcycles/Detail
- [x] Availability/Calendar
- [x] Contact/Form
- [x] Blog/PostList
- [x] Blog/PostDetail

_Note: Check the box [x] when the component has been translated._
