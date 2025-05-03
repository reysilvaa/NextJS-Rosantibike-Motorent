'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import LanguageSwitcher from '@/components/shared/language/language-switcher';
import { ThemeToggle } from '@/components/shared/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavbar } from '@/hooks/common/use-navbar';
import { cn } from '@/lib/utils/utils';

export default function Navbar() {
  const {
    isScrolled,
    pathname,
    locale,
    t,
    isHomePage,
    shouldUseWhiteStyle,
    isLightAndNotScrolled,
    shouldUseDarkStyle,
    logoSrc,
    localizedNavLinks,
    navbarStyle,
    isLightTheme
  } = useNavbar();

  // Fungsi untuk menentukan style text navbar berdasarkan kondisi
  const getTextStyle = (isActive = false) => {
    if (shouldUseWhiteStyle) return isActive ? 'text-white' : 'text-white/80 hover:text-white';
    if (shouldUseDarkStyle) return isActive ? 'text-foreground' : 'text-foreground/80 hover:text-foreground';
    if (isActive) return 'text-primary';
    return 'text-muted-foreground hover:text-primary';
  };

  // Fungsi untuk menentukan style border navbar berdasarkan kondisi
  const getBorderStyle = () => {
    if (shouldUseWhiteStyle) return 'bg-white/70';
    if (shouldUseDarkStyle) return 'bg-foreground/70';
    return 'bg-primary/70';
  };

  // Tentukan class header berdasarkan kondisi
  const headerClass = cn(
    'fixed top-0 w-full z-50 will-change-transform transform-gpu',
    isHomePage 
      ? (isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/20 shadow-sm' : 'bg-transparent')
      : (isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/20 shadow-sm' : 'bg-background/70 backdrop-blur-sm')
  );

  // Pilih logo untuk mobile berdasarkan tema
  const mobileLogoSrc = isLightTheme ? '/logo/logo2.svg' : '/logo/logo1.svg';

  // Komponen Link Navigasi Desktop
  const DesktopNavLink = ({ href, label }: { href: string, label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'text-sm font-medium transition-all duration-300 relative group',
          'h-[var(--navbar-item-height)] flex items-center px-[var(--navbar-item-spacing)]',
          getTextStyle(isActive)
        )}
      >
        <span className="relative z-10">{label}</span>
        <span
          className={cn(
            'absolute bottom-0 left-0 w-0 h-[var(--navbar-border-size)] transition-all duration-300 group-hover:w-full rounded-full',
            getBorderStyle(),
            isActive ? 'w-full' : ''
          )}
        ></span>
        <span
          className={cn(
            'absolute inset-0 rounded-md scale-0 transition-transform duration-300 group-hover:scale-100 origin-bottom',
            shouldUseWhiteStyle
              ? 'bg-white/10'
              : shouldUseDarkStyle
                ? 'bg-foreground/5'
                : 'bg-primary/5',
            isActive ? 'scale-100' : ''
          )}
        ></span>
      </Link>
    );
  };

  // Komponen Link Navigasi Mobile
  const MobileNavLink = ({ href, label }: { href: string, label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center py-3 px-2 text-base font-medium transition-colors duration-200 hover:text-primary relative group rounded-lg',
          isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-primary/5'
        )}
      >
        {label}
        <span
          className={cn(
            'absolute bottom-2 left-2 h-[var(--navbar-border-size)] bg-primary/50 transition-all duration-200 rounded-full',
            isActive ? 'w-12' : 'w-0 group-hover:w-12'
          )}
        ></span>
      </Link>
    );
  };

  return (
    <header className={headerClass} style={navbarStyle}>
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center group">
          <span
            className={cn(
              'text-2xl font-bold relative',
              shouldUseWhiteStyle
                ? 'text-white'
                : shouldUseDarkStyle
                  ? 'text-foreground'
                  : isLightAndNotScrolled
                      ? 'text-foreground'
                      : 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70'
            )}
          >
            <Image
              src={logoSrc}
              alt="Rosantibike Motorent"
              width={120}
              height={40}
              className="h-[var(--navbar-logo-height)] w-auto"
            />
            <span
              className={cn(
                'absolute -bottom-1 left-0 w-0 h-[var(--navbar-border-size)] transition-all duration-500 group-hover:w-full',
                getBorderStyle()
              )}
            ></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center" style={{ gap: 'var(--navbar-link-margin)' }}>
          {localizedNavLinks.map(link => (
            <DesktopNavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Actions - Fixed width container to prevent shifting */}
        <div 
          className="hidden md:flex items-center justify-end" 
          style={{ gap: 'var(--navbar-item-spacing)', minWidth: '190px' }}
        >
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
                'md:hidden rounded-full',
                shouldUseWhiteStyle
                  ? 'hover:bg-white/10 text-white'
                  : shouldUseDarkStyle
                    ? 'hover:bg-foreground/10 text-foreground'
                    : 'hover:bg-primary/10 text-foreground'
              )}
              style={{ 
                height: 'var(--navbar-item-height)', 
                width: 'var(--navbar-item-height)' 
              }}
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
                <Link href={`/${locale}`} className="flex items-center group">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    <Image
                      src={mobileLogoSrc}
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
                {localizedNavLinks.map(link => (
                  <MobileNavLink key={link.href} href={link.href} label={link.label} />
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
