import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import ar from '../locales/ar.json';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

export type Language = 'ar' | 'fr' | 'en';

type Translations = typeof ar;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translationsMap: Record<Language, Translations> = {
  ar,
  fr,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'app_language_preference';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY) as Language;
        if (saved && (saved === 'ar' || saved === 'fr' || saved === 'en')) {
          setLanguageState(saved);
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch (e) {
      // Ignore storage errors
    }
  };

  const isRTL = language === 'ar';

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translationsMap[language] || translationsMap.ar;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to Arabic if key not found
        let fallback: any = translationsMap.ar;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return path;
          }
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
