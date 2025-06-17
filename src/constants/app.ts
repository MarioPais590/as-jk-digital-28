
export const APP_CONFIG = {
  NAME: 'Finanças JK',
  VERSION: 'v1.0.0',
  YEAR: '2024',
  DEVELOPER: 'Mário',
  DEVELOPER_FULL: 'Mário Augusto',
  DESCRIPTION: 'Aplicativo de gestão financeira pessoal',
  LOGO_PATH: '/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png',
} as const;

export const CURRENCY_CONFIG = {
  DEFAULT: 'BRL',
  LOCALE: 'pt-BR',
} as const;

export const DATE_CONFIG = {
  LOCALE: 'pt-BR',
  FORMATS: {
    SHORT_MONTH: { month: 'short' as const },
    LONG_MONTH_YEAR: { month: 'long' as const, year: 'numeric' as const },
  },
} as const;
