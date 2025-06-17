
import { useState, useEffect } from 'react';
import { storageUtils } from '@/utils/localStorage';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => storageUtils.getTheme());

  useEffect(() => {
    storageUtils.setTheme(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
};
