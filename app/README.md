# App

Folder ini berisi seluruh struktur aplikasi Next.js menggunakan App Router. Struktur folder mencerminkan rute dan navigasi aplikasi.

## Struktur Folder

### Folder Rute (Publik)

1. **/** - Halaman Beranda
   - `page.tsx` - Halaman utama aplikasi

2. **/motorcycles** - Halaman Motor
   - Daftar, detail, dan pencarian motor

3. **/availability** - Ketersediaan Motor
   - Cek ketersediaan berdasarkan tanggal

4. **/blog** - Blog
   - Artikel, berita, dan konten informasional

5. **/booking** - Proses Pemesanan
   - Form dan langkah-langkah reservasi motor

6. **/booking-success** - Konfirmasi Pesanan Berhasil
   - Tampilan sukses setelah pemesanan

7. **/booking-history** - Riwayat Pemesanan
   - Daftar pemesanan yang telah dilakukan

8. **/profile** - Profil Pengguna
   - Informasi dan pengaturan akun

9. **/contact** - Halaman Kontak
   - Form kontak dan informasi

10. **/login** - Halaman Login
    - Form autentikasi

11. **/not-found** - Halaman Tidak Ditemukan (404)
    - Ditampilkan untuk URL tidak valid

### Folder Admin

12. **/dashboard** - Dashboard Admin
    - Panel admin untuk manajemen aplikasi

### Folder Utilitas

1. **/_lib** - Library dan Utilitas
   - `providers.tsx` - Providers untuk context global

2. **/_components** - Komponen Khusus App
   - Komponen yang digunakan hanya dalam app router

3. **/_styles** - File CSS
   - `globals.css` - Global CSS untuk seluruh aplikasi

## Penggunaan

Next.js App Router menggunakan konvensi file:

- `page.tsx` - Halaman yang dapat diakses publik
- `layout.tsx` - Layout yang membungkus halaman
- `loading.tsx` - Tampilan loading untuk halaman
- `error.tsx` - Tampilan error untuk halaman
- `not-found.tsx` - Tampilan 404 untuk halaman

## Penting Diketahui

1. **Route Groups**:
   - Folder dengan format `(folderName)` adalah route groups dan tidak memengaruhi URL

2. **Private Routes**:
   - Folder dengan awalan `_` (underscore) adalah privat dan tidak terekspos sebagai rute

3. **Parallel Routes**:
   - Folder dengan format `@folderName` adalah parallel routes untuk tampilan bersisian

4. **Intercepting Routes**:
   - Folder dengan format `(.)folderName` adalah intercepting routes untuk modal/overlay 