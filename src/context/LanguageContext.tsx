import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, TranslationDict } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const explicit = localStorage.getItem('chhath_lang_explicit');
      if (explicit === 'true') {
        const saved = localStorage.getItem('chhath_lang') as Language;
        if (saved && translations[saved]) return saved;
      }
    } catch {}
    return 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('chhath_lang', lang);
      localStorage.setItem('chhath_lang_explicit', 'true');
    } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
