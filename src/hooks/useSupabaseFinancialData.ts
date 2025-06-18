
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, FinancialSummary, MonthlyBalance, DailyBalance } from '@/types/financial';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useSupabaseFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  // Load transactions from Supabase
  const loadTransactions = async () => {
    // Don't load if auth is still loading or user is not authenticated
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

      // Convert Supabase data to app format
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

  useEffect(() => {
    // Only load transactions when auth is ready and user is authenticated
    if (!authLoading) {
      loadTransactions();
    }
  }, [isAuthenticated, user, authLoading]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transaction.type,
          amount: transaction.amount,
          date: transaction.date,
          category: transaction.category,
          description: transaction.description,
          notes: transaction.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar transação:', error);
        throw error;
      }

      // Add to local state
      const newTransaction: Transaction = {
        id: data.id,
        type: data.type as 'entrada' | 'saida',
        amount: Number(data.amount),
        date: data.date,
        category: data.category,
        description: data.description || '',
        notes: data.notes || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          type: updates.type,
          amount: updates.amount,
          date: updates.date,
          category: updates.category,
          description: updates.description,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar transação:', error);
        throw error;
      }

      // Update local state
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id
            ? {
                ...transaction,
                type: data.type as 'entrada' | 'saida',
                amount: Number(data.amount),
                date: data.date,
                category: data.category,
                description: data.description || '',
                notes: data.notes || '',
                updatedAt: data.updated_at
              }
            : transaction
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar transação:', error);
        throw error;
      }

      // Remove from local state
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  };

  const getMonthlyData = (year: number, month: number): FinancialSummary => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const totalEntradas = monthTransactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSaidas = monthTransactions
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalEntradas,
      totalSaidas,
      saldoAtual: totalEntradas - totalSaidas,
      transacoesCount: monthTransactions.length,
    };
  };

  const getYearlyData = (year: number): MonthlyBalance[] => {
    const monthlyData: MonthlyBalance[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });

      const entradas = monthTransactions
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);

      const saidas = monthTransactions
        .filter(t => t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: new Date(year, month).toLocaleString('pt-BR', { month: 'short' }),
        year,
        entradas,
        saidas,
        saldo: entradas - saidas,
      });
    }

    return monthlyData;
  };

  const getDailyBalances = (year: number, month: number): DailyBalance[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyBalances: DailyBalance[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      const entradas = dayTransactions
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);
      const saidas = dayTransactions
        .filter(t => t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);

      dailyBalances.push({
        date: dateStr,
        balance: entradas - saidas,
      });
    }

    return dailyBalances;
  };

  return {
    transactions,
    loading: loading || authLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    getYearlyData,
    getDailyBalances,
    refreshTransactions: loadTransactions
  };
};
