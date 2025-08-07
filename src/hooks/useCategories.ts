
import * as React from 'react';
import { useCategoryContext } from '@/contexts/CategoryContext';

// Este hook agora é apenas um wrapper para manter compatibilidade
export const useCategories = () => {
  return useCategoryContext();
};
