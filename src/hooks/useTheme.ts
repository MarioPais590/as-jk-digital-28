
import React from 'react';
import { useTheme as useThemeContext } from '@/components/ThemeProvider';

export const useTheme = () => {
  const { theme, setTheme } = useThemeContext();
  
  const isDark = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [theme]);
  
  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  return {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  };
};
