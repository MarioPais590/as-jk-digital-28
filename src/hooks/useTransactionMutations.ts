
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
      console.log('Iniciando atualização da transação:', { id, updates });
      
      // Prepare update data with strict validation
      const updateData: any = {};
      
      // Only include fields that are actually being updated and are valid
      if (updates.type !== undefined && ['entrada', 'saida'].includes(updates.type)) {
        updateData.type = updates.type;
      }
      
      if (updates.amount !== undefined) {
        const amount = Number(updates.amount);
        if (!isNaN(amount) && amount >= 0) {
          updateData.amount = amount;
        } else {
          throw new Error('Valor inválido. Deve ser um número maior ou igual a zero.');
        }
      }
      
      if (updates.date !== undefined && updates.date.trim() !== '') {
        updateData.date = updates.date;
      }
      
      if (updates.category !== undefined && updates.category.trim() !== '') {
        updateData.category = updates.category;
      }
      
      if (updates.description !== undefined) {
        updateData.description = updates.description.trim();
      }
      
      if (updates.notes !== undefined) {
        updateData.notes = updates.notes.trim();
      }
      
      if (updates.cartao_id !== undefined) {
        updateData.cartao_id = updates.cartao_id === 'cash' ? null : updates.cartao_id;
      }

      console.log('Dados para atualização:', updateData);

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        console.warn('Nenhum campo válido para atualizar');
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id) // Extra security check
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado ao atualizar transação:', {
          error,
          id,
          updateData,
          userId: user.id
        });
        throw error;
      }

      console.log('Transação atualizada com sucesso:', data);

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
