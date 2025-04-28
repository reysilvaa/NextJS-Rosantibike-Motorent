'use client';

import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import Link from 'next/link';

import { useAppTranslations } from '@/i18n/hooks';

export default function Footer() {
  const { t } = useAppTranslations();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">
              RosantiBike Motorent
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('footerDescription')} - Rental motor terbaik di Malang dengan pelayanan terpercaya,
              harga terjangkau, dan motor berkualitas.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com/rosantibike"
                className="text-muted-foreground hover:text-primary"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com/rosantibike"
                className="text-muted-foreground hover:text-primary"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/rosantibike"
                className="text-muted-foreground hover:text-primary"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Beranda"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/motorcycles"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Koleksi Motor"
                >
                  {t('motorcycles')}
                </Link>
              </li>
              <li>
                <Link
                  href="/availability"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Cek Ketersediaan"
                >
                  {t('checkAvailability')}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Blog dan Artikel"
                >
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Hubungi Kami"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('rentalInfo')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Cara Kerja"
                >
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Syarat dan Ketentuan"
                >
                  {t('rentalTerms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Pertanyaan Umum"
                >
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Kebijakan Privasi"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('contactUs')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-muted-foreground">
                  Jl. Soekarno Hatta No.123, Malang, Jawa Timur, Indonesia
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <Link href="tel:+628123456789" className="text-muted-foreground hover:text-primary">
                  +62 812-3456-789
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <Link
                  href="mailto:info@rosantibikemotorent.com"
                  className="text-muted-foreground hover:text-primary"
                >
                  info@rosantibikemotorent.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-muted-foreground text-sm">
          <p>
            {t('copyright', { year: new Date().getFullYear() })} - Rosantibike Motorent | Rental
            Motor Terbaik di Malang
          </p>
        </div>
      </div>
    </footer>
  );
}
