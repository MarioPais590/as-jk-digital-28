
import { useMemo, useCallback } from 'react';
import { useThemeContext } from '@/components/ThemeProvider';

export const useTheme = () => {
  const { theme, setTheme } = useThemeContext();
  
  const isDark = useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [theme]);
  
  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  return useMemo(() => ({
    theme,
    setTheme,
    isDark,
    toggleTheme,
  }), [theme, setTheme, isDark, toggleTheme]);
};
