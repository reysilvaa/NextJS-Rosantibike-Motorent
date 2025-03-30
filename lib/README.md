# Rental App Library

Folder ini berisi library kode yang digunakan dalam aplikasi Rental Motor. Library ini diorganisir berdasarkan fungsi dan domain untuk memudahkan pemeliharaan dan pengembangan.

## Struktur Folder

```
/lib/
  ├── api/                   # Kode terkait API dan komunikasi dengan backend
  │   ├── client.ts          # Axios client
  │   ├── config.ts          # Konfigurasi API (endpoint, headers)
  │   ├── interceptors.ts    # Interceptor untuk request dan response
  │   ├── services.ts        # Layanan API (fetch, create, update)
  │   └── index.ts           # Ekspor untuk api
  ├── types/                 # Definisi tipe untuk seluruh aplikasi
  │   ├── api.ts             # Tipe API generik
  │   ├── auth/              # Tipe autentikasi
  │   ├── motorcycle/        # Tipe untuk motor
  │   ├── transaction/       # Tipe untuk transaksi
  │   ├── blog/              # Tipe untuk blog
  │   └── index.ts           # Ekspor untuk types
  ├── utils/                 # Utility functions
  │   ├── formatters.ts      # Fungsi format (currency, date)
  │   ├── validation.ts      # Fungsi validasi
  │   ├── date.ts            # Fungsi terkait tanggal
  │   └── index.ts           # Ekspor untuk utils
  ├── socket/                # Kode socket.io
  │   └── index.ts           # Implementasi socket
  └── index.ts               # Main entry point untuk lib
```

## Penggunaan

Gunakan module ini dengan cara berikut:

```typescript
// Import dari root lib
import { formatCurrency, apiClient, Transaction } from '@/lib'

// Atau import spesifik dari subfolder
import { formatCurrency } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import type { Transaction } from '@/lib/types'
```

## Perawatan Kode

Saat menambahkan kode baru, harap mengikuti konvensi berikut:
- Tempatkan fungsi di folder yang sesuai dengan domain fungsinya
- Gunakan TypeScript untuk semua kode
- Dokumentasikan fungsi dengan JSDoc
- Re-ekspor fungsi melalui file `index.ts` untuk memudahkan penggunaan 