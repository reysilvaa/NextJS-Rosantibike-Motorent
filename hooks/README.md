# Rental App Hooks

Folder ini berisi custom React hooks yang digunakan dalam aplikasi Rental Motor. Hook diorganisasi berdasarkan fungsi dan domain untuk memudahkan pemeliharaan dan pengembangan.

## Struktur Folder Hooks

Hooks telah diatur menjadi beberapa kategori logis:

1. **api/** - Hooks untuk interaksi dengan API dan data fetching
2. **ui/** - Hooks untuk manipulasi UI dan interaksi pengguna
3. **socket/** - Hooks untuk koneksi dan komunikasi socket
4. **context/** - Hooks yang menerapkan pola Context Provider

## Hubungan dengan Folder Contexts

Selain hooks yang berada di folder `hooks/`, aplikasi ini juga memiliki konteks React di folder `frontend/contexts/`. Saat ini, kami sedang dalam proses konsolidasi dan pengorganisasian antara kedua folder tersebut.

### Struktur Contexts
- `socket-context.tsx` - Konteks untuk manajemen koneksi socket
- `motorcycle-filter-context.tsx` - Konteks untuk filter motor
- `video-context.tsx` - Konteks untuk pengelolaan pemutaran video

Konteks-konteks dari folder `contexts/` di-re-export dalam `hooks/index.ts` untuk kemudahan akses.

### Rencana Refactoring

Untuk meningkatkan organisasi kode, kami sedang melaksanakan:

1. ✅ Memindahkan semua Context Providers ke dalam folder `hooks/context/` dengan penamaan yang konsisten
   - `use-auth-provider.tsx` - Provider untuk autentikasi
   - `use-socket-provider.tsx` - Provider untuk koneksi socket
   - `use-video-provider.tsx` - Provider untuk video player management
   - `use-motorcycle-filter-provider.tsx` - Provider untuk filter motor

2. ✅ Menggunakan re-export pada files hook spesifik:
   - `socket/use-socket.ts` -> mengekspor `useSocket` dari provider
   - Dan seterusnya untuk hooks lainnya

3. ✅ Menstandarisasi penamaan:
   - Provider components: `<Name>Provider` (contoh: `AuthProvider`)
   - Provider hooks: `use<Name>` (contoh: `useAuth`)

4. Semua hook yang berhubungan dengan context sekarang diexport melalui `hooks/index.ts` untuk kemudahan akses.

5. Folder `frontend/contexts/` akan dihapus setelah masa transisi untuk memastikan semua referensi telah diperbarui.

## Penggunaan

Gunakan hooks ini dengan cara berikut:

```typescript
// Import dari root hooks
import { useLoading, useAuth, useTransactions } from '@/hooks'

// Atau import spesifik dari subfolder
import { useLoading } from '@/hooks/ui/use-loading'
import { useAuth } from '@/hooks/api/use-auth'
```

## Perawatan Kode

Saat menambahkan hooks baru, harap mengikuti konvensi berikut:
- Tempatkan hooks di folder yang sesuai dengan fungsinya
- Gunakan format penamaan 'use-{nama-hook}.ts'
- Dokumentasikan hooks dengan JSDoc
- Re-ekspor hooks melalui file `index.ts` untuk memudahkan penggunaan
- Pisahkan logika yang kompleks menjadi beberapa hooks yang lebih kecil 