
import { useSupabaseFinancialData } from './useSupabaseFinancialData';

// Re-export everything from the Supabase hook to maintain compatibility
export const useFinancialData = () => {
  return useSupabaseFinancialData();
};
