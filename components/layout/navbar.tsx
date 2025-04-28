'use client';

import { Bike, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import LanguageSwitcher from '@/components/shared/language/language-switcher';
import { ThemeToggle } from '@/components/shared/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAppTranslations } from '@/i18n/hooks';
import { cn } from '@/lib/utils/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t  } = useAppTranslations();
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
  const isHomePage = pathname === '/';

  // Kondisi untuk mengubah style navbar sesuai home page
  const shouldUseWhiteStyle = isLightTheme && !isScrolled && isHomePage;

  useEffect(() => {
    // Using requestAnimationFrame for smoother performance
    let lastScrollY = window.scrollY;
    let animationFrameId = 0;
    let scrollTimeout = setTimeout(() => {});

    // Clear initial timeout
    clearTimeout(scrollTimeout);
    animationFrameId = 0;

    const handleScroll = () => {
      if (animationFrameId) return;

      animationFrameId = window.requestAnimationFrame(() => {
        // Only update if scroll position changed by more than 2px
        if (Math.abs(window.scrollY - lastScrollY) > 2) {
          setIsScrolled(window.scrollY > 10);
          lastScrollY = window.scrollY;
        }

        animationFrameId = 0;

        // Clear previous timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);

        // Set a timeout to ensure state is updated when scrolling stops
        scrollTimeout = setTimeout(() => {
          setIsScrolled(window.scrollY > 10);
        }, 100);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/motorcycles', label: t('motorcycles') },
    { href: '/availability', label: t('availability') },
    { href: '/booking-history', label: t('bookingHistory') },
    { href: '/blog', label: t('blog') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 will-change-transform',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/20 shadow-sm'
          : 'bg-transparent',
        // Using transform-gpu for better performance
        'transform-gpu transition-all duration-300 ease-out'
      )}
      style={{
        paddingTop: isScrolled ? '0.5rem' : '1rem',
        paddingBottom: isScrolled ? '0.5rem' : '1rem',
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center group">
          {/* <div className="mr-2 flex items-center justify-center rounded-full bg-primary/10 p-1.5 group-hover:bg-primary/20 transition-colors duration-300 animate-pulse-soft">
            <Bike className={cn("h-5 w-5", shouldUseWhiteStyle ? "text-white" : "text-primary")} />
          </div> */}
          <span
            className={cn(
              'text-2xl font-bold relative',
              shouldUseWhiteStyle
                ? 'text-white'
                : 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70'
            )}
          >
            <Image
              src={
                isHomePage
                  ? isLightTheme
                    ? isScrolled
                      ? '/logo/logo2.svg'
                      : '/logo/logo1.svg'
                    : '/logo/logo1.svg'
                  : '/logo/logo2.svg'
              }
              alt="Rosantibike Motorent"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <span
              className={cn(
                'absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full',
                shouldUseWhiteStyle ? 'bg-white/70' : 'bg-primary/50'
              )}
            ></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-all duration-300 relative group py-1.5',
                pathname === link.href
                  ? shouldUseWhiteStyle
                    ? 'text-white'
                    : 'text-primary'
                  : shouldUseWhiteStyle
                    ? 'text-white/80 hover:text-white'
                    : 'text-muted-foreground hover:text-primary'
              )}
            >
              <span className="relative z-10">{link.label}</span>
              <span
                className={cn(
                  'absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full',
                  shouldUseWhiteStyle ? 'bg-white/70' : 'bg-primary/70',
                  pathname === link.href ? 'w-full' : ''
                )}
              ></span>
              <span
                className={cn(
                  'absolute inset-0 rounded-md scale-0 transition-transform duration-300 group-hover:scale-100 origin-bottom',
                  shouldUseWhiteStyle ? 'bg-white/10' : 'bg-primary/5',
                  pathname === link.href ? 'scale-100' : ''
                )}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Actions - Fixed width container to prevent shifting */}
        <div className="hidden md:flex items-center gap-3 min-w-[190px] justify-end">
          <div className="relative">
            <LanguageSwitcher useWhiteStyle={shouldUseWhiteStyle} />
          </div>
          <div className="relative">
            <ThemeToggle useWhiteStyle={shouldUseWhiteStyle} />
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'md:hidden h-9 w-9 rounded-full',
                shouldUseWhiteStyle
                  ? 'hover:bg-white/10 text-white'
                  : 'hover:bg-primary/10 text-foreground'
              )}
              aria-label={t('mobileMenuTitle') || 'Menu'}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('mobileMenuTitle') || 'Menu'}</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-l border-border/20 bg-background/95 backdrop-blur-xl w-[280px] p-0"
          >
            <SheetTitle className="sr-only">{t('mobileMenuTitle')}</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border/30">
                <Link href="/" className="flex items-center group">
                  <div className="mr-2 flex items-center justify-center rounded-full bg-primary/10 p-1.5">
                    <Bike className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    <Image
                      src={
                        isHomePage
                          ? isScrolled
                            ? '/logo/logo2.svg'
                            : '/logo/logo1.svg'
                          : '/logo/logo2.svg'
                      }
                      alt="RosantiBike Motorent"
                      width={96}
                      height={32}
                      className="h-8 w-auto"
                      priority
                    />
                  </span>
                </Link>
              </div>

              <nav className="flex flex-col p-4 overflow-y-auto">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center py-3 px-2 text-base font-medium transition-colors duration-200 hover:text-primary relative group rounded-lg',
                      pathname === link.href
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:bg-primary/5'
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'absolute bottom-2 left-2 h-0.5 bg-primary/50 transition-all duration-200 rounded-full',
                        pathname === link.href ? 'w-12' : 'w-0 group-hover:w-12'
                      )}
                    ></span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-4 space-y-4 border-t border-border/30">
                <div className="flex items-center justify-between py-2 px-2 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium">{t('theme')}</span>
                  <ThemeToggle useWhiteStyle={false} />
                </div>

                <div className="flex items-center justify-between py-2 px-2 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium">{t('language')}</span>
                  <LanguageSwitcher useWhiteStyle={false} />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
