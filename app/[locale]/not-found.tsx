'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAppTranslations } from '@/i18n/hooks';

export default function NotFound() {
  const { t } = useAppTranslations();

  return (
    <div className="bg-gradient-to-b from-accent to-background min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex justify-center">
            <div className="bg-secondary/70 p-6 rounded-full">
              <AlertTriangle className="h-16 w-16 text-foreground" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-foreground">404</h1>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            {t('pageNotFound') || 'Halaman tidak ditemukan'}
          </h2>
          <p className="text-foreground/75 mb-8 max-w-md mx-auto">
            {t('pageNotFoundDesc') ||
              'Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan atau dihapus.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                {t('backToHome') || 'Kembali ke Beranda'}
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4" />
                {t('goBack') || 'Kembali ke Halaman Sebelumnya'}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 