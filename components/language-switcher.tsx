"use client"

import { useTranslation } from "@/i18n/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from "lucide-react";

export default function LanguageSwitcher() {
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
          className="flex items-center gap-1 px-2 h-8"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium text-xs">{language?.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={language === lang ? "bg-accent font-medium" : ""}
          >
            {languageLabels[lang]}
            {language === lang && <Check className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 