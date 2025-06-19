
import { CURRENCY_CONFIG, DATE_CONFIG } from '@/constants/app';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, { 
    style: 'currency', 
    currency: CURRENCY_CONFIG.DEFAULT 
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(DATE_CONFIG.LOCALE);
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString(DATE_CONFIG.LOCALE, DATE_CONFIG.FORMATS.LONG_MONTH_YEAR);
};

export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};
