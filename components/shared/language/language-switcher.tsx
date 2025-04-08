"use client"

import { useTranslation } from "@/i18n/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from 'lucide-react';
import { cn } from "@/lib/utils/utils";

interface LanguageSwitcherProps {
  useWhiteStyle?: boolean;
}

export default function LanguageSwitcher({ useWhiteStyle = false }: LanguageSwitcherProps) {
  const { language, changeLanguage, languages, t } = useTranslation();

  // Label bahasa untuk UI
  const languageLabels: Record<string, string> = {
    id: "Indonesia",
    en: "English",
  };

  const handleLanguageChange = (lang: string) => {
    if (lang !== language) {
      changeLanguage(lang as any);
    }   
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "flex items-center gap-1.5 px-2 h-8 w-[42px] transition-colors duration-300",
            useWhiteStyle
              ? "hover:bg-white/10"
              : "hover:bg-primary/10"
          )}
        >
          <div className={cn(
            "size-6 rounded-full flex items-center justify-center",
            useWhiteStyle
              ? "bg-white/20"
              : "bg-primary/10"
          )}>
            <Globe className={cn(
              "h-3.5 w-3.5",
              useWhiteStyle
                ? "text-white"
                : "text-primary"
            )} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        sideOffset={8} 
        className="z-[60] w-[140px] bg-card/95 backdrop-blur-lg border-border/50 shadow-lg rounded-xl p-1 animate-in fade-in-0 zoom-in-95 duration-100"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={cn(
              "flex items-center justify-between rounded-lg cursor-pointer transition-colors duration-200",
              language === lang 
                ? "bg-primary/10 text-primary font-medium" 
                : "hover:bg-primary/5"
            )}
          >
            <div className="flex items-center">
              <span className="text-xs font-bold uppercase mr-2 opacity-70">{lang}</span>
              {languageLabels[lang]}
            </div>
            {language === lang && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
