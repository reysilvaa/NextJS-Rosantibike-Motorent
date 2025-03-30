'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Komponen redirector untuk not-found
 * Next.js membutuhkan file not-found.tsx di root untuk custom 404
 * Kita menggunakan komponen ini untuk redirect ke halaman /not-found
 */
export default function NotFoundRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/not-found');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-medium">Mengalihkan ke halaman tidak ditemukan...</p>
    </div>
  );
} 