import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const explicitChoice = localStorage.getItem('chhath_user_theme_chosen_v2');
      if (explicitChoice) {
        const saved = localStorage.getItem('chhath_theme') as Theme;
        if (saved === 'light' || saved === 'dark') return saved;
      }
      return 'light'; // Clean professional light theme by default as requested
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('chhath_theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  // Clean up any residual legacy easyMode attributes
  useEffect(() => {
    try {
      document.documentElement.classList.remove('easy-mode');
      localStorage.removeItem('chhath_easy_mode');
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('chhath_user_theme_chosen_v2', 'true');
      } catch {}
      return next;
    });
  };

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem('chhath_user_theme_chosen_v2', 'true');
    } catch {}
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
