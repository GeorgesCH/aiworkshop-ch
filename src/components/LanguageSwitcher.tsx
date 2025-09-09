import React from "react";
import { ChevronDown, Languages } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage, Language } from "./LanguageProvider";
// Removed vike/client/router import - using standard navigation instead

const languages = [
  { code: "en" as Language, name: "English", flag: "🇬🇧" },
  { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLang: Language) => {
    // Update the language context first
    setLanguage(newLang);
    
    // Get current path and replace language prefix to preserve the current page
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
    const newPath = `/${newLang}${pathWithoutLang}`;

    // Navigate to the new URL
    window.location.href = newPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm">{currentLanguage?.code.toUpperCase()}</span>
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">{t('common.switch_language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2 text-sm font-medium">{lang.code.toUpperCase()}</span>
            <span>{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-xs text-gray-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}