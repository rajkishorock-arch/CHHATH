import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  easyMode: boolean;
  toggleEasyMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('chhath_theme') as Theme;
    return saved || 'light';
  });

  const [easyMode, setEasyMode] = useState<boolean>(() => {
    return localStorage.getItem('chhath_easy_mode') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('chhath_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (easyMode) {
      document.documentElement.classList.add('easy-mode');
    } else {
      document.documentElement.classList.remove('easy-mode');
    }
    localStorage.setItem('chhath_easy_mode', String(easyMode));
  }, [easyMode]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleEasyMode = () => {
    setEasyMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, easyMode, toggleEasyMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

