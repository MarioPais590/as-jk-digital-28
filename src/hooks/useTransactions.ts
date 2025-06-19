
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useTransactions = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadTransactions = async () => {
    if (authLoading || !isAuthenticated || !user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Loading transactions for user:', user.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar transações:', error);
        setTransactions([]);
        return;
      }

      const formattedTransactions: Transaction[] = (data || []).map(item => ({
        id: item.id,
        type: item.type as 'entrada' | 'saida',
        amount: Number(item.amount),
        date: item.date,
        category: item.category,
        description: item.description || '',
        notes: item.notes || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!authLoading) {
      loadTransactions();
    }
  }, [isAuthenticated, user, authLoading]);

  return {
    transactions,
    loading: loading || authLoading,
    refreshTransactions: loadTransactions,
    setTransactions
  };
};
