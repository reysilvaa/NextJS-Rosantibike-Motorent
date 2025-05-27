'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import LanguageSwitcher from '@/components/shared/language/language-switcher';
import { ThemeToggle } from '@/components/shared/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavbar } from '@/hooks/common/use-navbar';
import { cn } from '@/lib/utils/utils';

// Add custom CSS for shimmer animation
const shimmerAnimation = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
`;

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    isScrolled,
    pathname,
    locale,
    t,
    isHomePage,
    shouldUseWhiteStyle,
    shouldUseDarkStyle,
    logoSrc,
    localizedNavLinks,
    navbarStyle,
    isLightTheme,
  } = useNavbar();

  // Add shimmer animation styles to head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = shimmerAnimation;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Auto close mobile menu when navigation occurs
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsMobileOpen(false);
        setIsNavigating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  // Enhanced text styling with better contrast ratios
  const getTextStyle = (isActive = false) => {
    if (shouldUseWhiteStyle) {
      return isActive
        ? 'text-white font-semibold'
        : 'text-white/90 hover:text-white font-medium hover:font-semibold';
    }
    if (shouldUseDarkStyle) {
      return isActive
        ? 'text-foreground font-semibold'
        : 'text-foreground/85 hover:text-foreground font-medium hover:font-semibold';
    }
    if (isActive) return 'text-primary font-semibold';
    return 'text-muted-foreground hover:text-primary font-medium hover:font-semibold';
  };

  // Enhanced border styling with gradient support
  const getBorderStyle = () => {
    if (shouldUseWhiteStyle) return 'bg-gradient-to-r from-white/80 via-white/60 to-white/80';
    if (shouldUseDarkStyle)
      return 'bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/80';
    return 'bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80';
  };

  // Enhanced header with better blur and glass effect
  const headerClass = cn(
    'fixed top-0 w-full z-50 will-change-transform transform-gpu transition-all duration-500 ease-out',
    isHomePage
      ? isScrolled
        ? 'bg-background/85 backdrop-blur-2xl border-b border-border/25 shadow-lg shadow-black/5'
        : 'bg-transparent backdrop-blur-none'
      : isScrolled
        ? 'bg-background/85 backdrop-blur-2xl border-b border-border/25 shadow-lg shadow-black/5'
        : 'bg-background/75 backdrop-blur-lg border-b border-border/15',
    // Add subtle hover effect to entire navbar
    'hover:shadow-xl hover:shadow-black/10 hover:backdrop-blur-2xl transition-all duration-300'
  );

  // Enhanced mobile logo logic
  const mobileLogoSrc = isLightTheme ? '/logo/logo2.svg' : '/logo/logo1.svg';

  // Enhanced Desktop Navigation Link with micro-interactions
  const DesktopNavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'text-base font-medium transition-all duration-300 relative group py-3 px-6',
          getTextStyle(isActive)
        )}
      >
        {label}

        {/* Simplified underline indicator */}
        <span
          className={cn(
            'absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out rounded-full',
            getBorderStyle(),
            isActive
              ? 'w-full opacity-100'
              : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
          )}
        />
      </Link>
    );
  };

  // Enhanced Mobile Navigation Link
  const MobileNavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsNavigating(true)}
        className={cn(
          'group flex items-center py-4 px-4 text-base font-medium transition-all duration-300',
          'hover:translate-x-2 active:scale-95',
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        )}
      >
        <span className="relative flex-1">
          {label}
          {/* Mobile active indicator */}
          <span
            className={cn(
              'absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 rounded-full',
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            )}
          />
        </span>
      </Link>
    );
  };

  return (
    <header className={headerClass} style={navbarStyle}>
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-6">
        {/* Simplified Logo without boxes */}
        <Link
          href={`/${locale}`}
          className="flex items-center transition-all duration-300 hover:opacity-80"
        >
          <Image
            src={logoSrc}
            alt="Rosantibike Motorent"
            width={120}
            height={40}
            className="h-[var(--navbar-logo-height)] w-auto"
            priority
          />
        </Link>

        {/* Simplified Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {localizedNavLinks.map(link => (
            <DesktopNavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Actions Container */}
        <div
          className="hidden md:flex items-center justify-end gap-3"
          style={{ minWidth: '120px' }}
        >
          <LanguageSwitcher useWhiteStyle={shouldUseWhiteStyle} />
          <ThemeToggle useWhiteStyle={shouldUseWhiteStyle} />
        </div>

        {/* Enhanced Mobile Navigation Trigger */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'md:hidden rounded-2xl relative overflow-hidden transition-all duration-300',
                'hover:scale-110 active:scale-90 border border-transparent',
                shouldUseWhiteStyle
                  ? 'hover:bg-white/15 hover:border-white/20 text-white hover:shadow-lg hover:shadow-white/10'
                  : shouldUseDarkStyle
                    ? 'hover:bg-foreground/15 hover:border-foreground/20 text-foreground hover:shadow-lg hover:shadow-foreground/5'
                    : 'hover:bg-primary/15 hover:border-primary/20 text-foreground hover:shadow-lg hover:shadow-primary/10'
              )}
              style={{
                height: 'var(--navbar-item-height)',
                width: 'var(--navbar-item-height)',
              }}
              aria-label={t('mobileMenuTitle') || 'Menu'}
            >
              {/* Animated hamburger/close icon */}
              <div className="relative w-5 h-5">
                <Menu
                  className={cn(
                    'absolute inset-0 transition-all duration-300',
                    isMobileOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 transition-all duration-300',
                    isMobileOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                  )}
                />
              </div>

              {/* Ripple effect background */}
              <span className="absolute inset-0 rounded-2xl bg-current opacity-0 hover:opacity-10 transition-opacity duration-300" />

              <span className="sr-only">{t('mobileMenuTitle') || 'Menu'}</span>
            </Button>
          </SheetTrigger>

          {/* Enhanced Mobile Sheet Content */}
          <SheetContent
            side="right"
            className={cn(
              'border-l border-border/30 w-[320px] p-0',
              'bg-gradient-to-b from-background/95 via-background/90 to-background/95',
              'backdrop-blur-2xl shadow-2xl shadow-black/20'
            )}
          >
            <SheetTitle className="sr-only">{t('mobileMenuTitle')}</SheetTitle>

            <div className="flex flex-col h-full relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />

              {/* Enhanced header section */}
              <div className="relative p-6 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent">
                <Link
                  href={`/${locale}`}
                  onClick={() => setIsNavigating(true)}
                  className="flex items-center group transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <Image
                      src={mobileLogoSrc}
                      alt="RosantiBike Motorent"
                      width={96}
                      height={32}
                      className="h-8 w-auto transition-all duration-300 group-hover:brightness-110"
                      priority
                    />
                    <span className="absolute -inset-2 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  </div>
                </Link>
              </div>

              {/* Enhanced navigation section */}
              <nav className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-2">
                  {localizedNavLinks.map((link, index) => (
                    <div
                      key={link.href}
                      className="transform transition-all duration-300"
                      style={{
                        animationDelay: `${(index + 1) * 100}ms`,
                      }}
                    >
                      <MobileNavLink href={link.href} label={link.label} />
                    </div>
                  ))}
                </div>
              </nav>

              {/* Enhanced footer section */}
              <div className="relative p-6 space-y-4 border-t border-border/40 bg-gradient-to-t from-primary/5 to-transparent">
                {/* Theme toggle section */}
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-border/50 hover:bg-background/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                    {t('theme')}
                  </span>
                  <div className="relative">
                    <ThemeToggle useWhiteStyle={false} />
                    <span className="absolute -inset-3 rounded-full bg-primary/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Language toggle section */}
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-border/50 hover:bg-background/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                    {t('language')}
                  </span>
                  <div className="relative">
                    <LanguageSwitcher useWhiteStyle={false} />
                    <span className="absolute -inset-3 rounded-full bg-primary/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
