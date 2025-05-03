import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { useAppTranslations } from '@/i18n/hooks';

export function useNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useAppTranslations();
  const { theme } = useTheme();
  
  // Tentukan kondisi dasar
  const isHomePage = pathname === `/${locale}` || pathname === '/';
  const isLightTheme = theme === 'light';

  // Sederhanakan logika style
  const navbarStyles = {
    // White style untuk homepage yang belum di-scroll
    shouldUseWhiteStyle: isHomePage && !isScrolled,
    
    // Dark style untuk halaman non-homepage dengan tema light
    shouldUseDarkStyle: isLightTheme && !isHomePage,
    
    // Kondisi light theme tapi belum di-scroll
    isLightAndNotScrolled: isLightTheme && !isScrolled
  };

  // Sederhanakan logika pemilihan logo
  const logoSrc = (!isLightTheme || (isHomePage && !isScrolled)) 
    ? '/logo/logo1.svg' 
    : '/logo/logo2.svg';

  // Buat object untuk CSS variables
  const navbarStyle = {
    '--navbar-link-margin': '0.75rem',
    '--navbar-item-spacing': '0.5rem',
    '--navbar-border-size': '1px',
    '--navbar-height': '4rem',
    '--navbar-logo-height': '2.5rem',
    '--navbar-item-height': '2.25rem',
    transition: 'background-color 0.3s ease-out, box-shadow 0.3s ease-out',
    height: 'var(--navbar-height)',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
  } as React.CSSProperties;

  // Optimasi event scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let animationFrameId = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (animationFrameId) return;

      animationFrameId = window.requestAnimationFrame(() => {
        // Hanya update jika posisi scroll berubah lebih dari 2px
        if (Math.abs(window.scrollY - lastScrollY) > 2) {
          setIsScrolled(window.scrollY > 10);
          lastScrollY = window.scrollY;
        }

        animationFrameId = 0;

        // Bersihkan timeout sebelumnya
        clearTimeout(scrollTimeout);

        // Set timeout untuk memastikan state diupdate saat scrolling berhenti
        scrollTimeout = setTimeout(() => {
          setIsScrolled(window.scrollY > 10);
        }, 100);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Fungsi untuk menyiapkan link navigasi
  const localizedNavLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/motorcycles`, label: t('motorcycles') },
    { href: `/${locale}/availability`, label: t('availability') },
    { href: `/${locale}/booking-history`, label: t('bookingHistory') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return {
    isScrolled,
    pathname,
    locale,
    t,
    isHomePage,
    isLightTheme,
    // Sebarkan kondisi style
    ...navbarStyles,
    logoSrc,
    localizedNavLinks,
    navbarStyle
  };
} 