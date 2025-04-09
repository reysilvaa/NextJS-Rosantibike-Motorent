'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundClient() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-accent to-background min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="bg-secondary/70 p-6 rounded-full">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold mb-4 text-foreground">404</h1>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Halaman tidak ditemukan
          </h2>
          <p className="text-foreground/75 mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan atau dihapus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Kembali ke Beranda</span>
            </Link>
            
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span>Kembali ke Halaman Sebelumnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
