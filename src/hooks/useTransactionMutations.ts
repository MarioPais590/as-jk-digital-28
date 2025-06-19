
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useTransactionMutations = (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  const { user } = useSupabaseAuth();

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

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
