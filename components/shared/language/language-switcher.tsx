'use client';

import { Check, Globe } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Locale, localeNames, locales as allLocales } from '@/i18n';
import { useAppTranslations } from '@/i18n/hooks';
import { cn } from '@/lib/utils/utils';

interface LanguageSwitcherProps {
  useWhiteStyle?: boolean;
}

export default function LanguageSwitcher({ useWhiteStyle = false }: LanguageSwitcherProps) {
  const { locale, changeLocale } = useAppTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  // Gunakan state untuk menyimpan daftar bahasa yang tersedia
  // Ini memastikan bahwa komponen selalu di-render ulang saat bahasa berubah
  const [availableLocales, setAvailableLocales] = useState<Locale[]>([...allLocales]);
  
  // useEffect untuk memastikan daftar bahasa selalu up-to-date
  useEffect(() => {
    console.log("Available locales:", allLocales);
    setAvailableLocales([...allLocales]);
  }, [pathname]);

  const handleLanguageChange = (lang: Locale) => {
    if (lang !== locale) {
      // Tambahkan log untuk debugging
      console.log("Changing language to:", lang);
      
      // Ubah bahasa dalam context
      changeLocale(lang);
      
      if (pathname) {
        const currentLocale = params?.locale || '';
        
        if (currentLocale && typeof currentLocale === 'string') {
          const newPath = pathname.replace(`/${currentLocale}`, `/${lang}`);
          router.push(newPath);
          
          // Refresh halaman tanpa mengubah URL
          setTimeout(() => {
            router.refresh();
          }, 100);
        } else {
          router.push(`/${lang}`);
          
          // Refresh halaman tanpa mengubah URL
          setTimeout(() => {
            router.refresh();
          }, 100);
        }
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'flex items-center gap-1.5 px-2 h-8 w-[42px] transition-colors duration-300',
            useWhiteStyle ? 'hover:bg-white/10' : 'hover:bg-primary/10'
          )}
        >
          <div
            className={cn(
              'size-6 rounded-full flex items-center justify-center',
              useWhiteStyle ? 'bg-white/20' : 'bg-primary/10'
            )}
          >
            <Globe className={cn('h-3.5 w-3.5', useWhiteStyle ? 'text-white' : 'text-primary')} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[60] w-[140px] bg-card/95 backdrop-blur-lg border-border/50 shadow-lg rounded-xl p-1 animate-in fade-in-0 zoom-in-95 duration-100"
      >
        {availableLocales.map((lang: Locale) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={cn(
              'flex items-center justify-between rounded-lg cursor-pointer transition-colors duration-200',
              locale === lang ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/5'
            )}
          >
            <div className="flex items-center">
              <span className="text-xs font-bold uppercase mr-2 opacity-70">{lang}</span>
              {localeNames[lang]}
            </div>
            {locale === lang && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
