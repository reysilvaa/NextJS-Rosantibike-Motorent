'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppTranslations } from '@/i18n/hooks';
import { cn } from '@/lib/utils/utils';

interface ThemeToggleProps {
  useWhiteStyle?: boolean;
}

export function ThemeToggle({ useWhiteStyle = false }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const { t  } = useAppTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'h-8 w-8 rounded-full transition-all duration-300 group',
            useWhiteStyle
              ? 'border-white hover:border-white/80 hover:bg-white/10'
              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
          )}
        >
          <Sun
            className={cn(
              'h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0',
              useWhiteStyle ? 'text-black group-hover:text-white' : ''
            )}
          />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('toggleTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[60] w-[180px] bg-card/95 backdrop-blur-lg border-border/50 shadow-lg rounded-xl p-1 animate-in fade-in-0 zoom-in-95 duration-100"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center gap-2 rounded-lg cursor-pointer transition-colors duration-200',
            theme === 'light' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/5'
          )}
        >
          <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Sun className="h-4 w-4 text-primary" />
          </div>
          {t('lightTheme')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center gap-2 rounded-lg cursor-pointer transition-colors duration-200',
            theme === 'dark' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/5'
          )}
        >
          <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Moon className="h-4 w-4 text-primary" />
          </div>
          {t('darkTheme')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center gap-2 rounded-lg cursor-pointer transition-colors duration-200',
            theme === 'system' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/5'
          )}
        >
          <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center">
            <svg
              className="h-4 w-4 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </div>
          {t('systemTheme')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
