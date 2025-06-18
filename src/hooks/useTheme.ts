
import { useTheme as useNextTheme } from '@/components/ThemeProvider';

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  };
};
