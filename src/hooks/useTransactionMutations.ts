
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useTransactionMutations = (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  const { user } = useSupabaseAuth();

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { cartao_id?: string }) => {
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
          notes: transaction.notes,
          cartao_id: transaction.cartao_id || null
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
        updatedAt: data.updated_at,
        cartao_id: data.cartao_id
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction> & { cartao_id?: string }) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Prepare update data, ensuring amount is positive and valid
      const updateData: any = {};
      
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.amount !== undefined && updates.amount > 0) updateData.amount = updates.amount;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.cartao_id !== undefined) updateData.cartao_id = updates.cartao_id || null;

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
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
                updatedAt: data.updated_at,
                cartao_id: data.cartao_id
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
