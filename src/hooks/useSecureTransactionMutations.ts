
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';
import { useSupabaseAuth } from './useSupabaseAuth';
import { validateTransactionAmount, validateTransactionDate, validateCategory, sanitizeInput } from '@/utils/inputValidation';

export const useSecureTransactionMutations = (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  const { user } = useSupabaseAuth();

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { cartao_id?: string }) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Validate all inputs
    const amountValidation = validateTransactionAmount(transaction.amount);
    if (!amountValidation.isValid) {
      throw new Error(amountValidation.error);
    }

    const dateValidation = validateTransactionDate(transaction.date);
    if (!dateValidation.isValid) {
      throw new Error(dateValidation.error);
    }

    const categoryValidation = validateCategory(transaction.category);
    if (!categoryValidation.isValid) {
      throw new Error(categoryValidation.error);
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transaction.type,
          amount: transaction.amount,
          date: transaction.date,
          category: sanitizeInput(transaction.category),
          description: sanitizeInput(transaction.description || ''),
          notes: sanitizeInput(transaction.notes || ''),
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
      
      // Log security event
      console.log('Transaction added successfully:', { 
        id: data.id, 
        type: data.type, 
        amount: data.amount,
        userId: user.id,
        timestamp: new Date().toISOString()
      });
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
      
      const updateData: any = {};
      
      if (updates.type !== undefined && ['entrada', 'saida'].includes(updates.type)) {
        updateData.type = updates.type;
      }
      
      if (updates.amount !== undefined) {
        const amountValidation = validateTransactionAmount(updates.amount);
        if (!amountValidation.isValid) {
          throw new Error(amountValidation.error);
        }
        updateData.amount = updates.amount;
      }
      
      if (updates.date !== undefined) {
        const dateValidation = validateTransactionDate(updates.date);
        if (!dateValidation.isValid) {
          throw new Error(dateValidation.error);
        }
        updateData.date = updates.date;
      }
      
      if (updates.category !== undefined) {
        const categoryValidation = validateCategory(updates.category);
        if (!categoryValidation.isValid) {
          throw new Error(categoryValidation.error);
        }
        updateData.category = sanitizeInput(updates.category);
      }
      
      if (updates.description !== undefined) {
        updateData.description = sanitizeInput(updates.description);
      }
      
      if (updates.notes !== undefined) {
        updateData.notes = sanitizeInput(updates.notes);
      }
      
      if (updates.cartao_id !== undefined) {
        updateData.cartao_id = updates.cartao_id === 'cash' ? null : updates.cartao_id;
      }

      console.log('Dados para atualização:', updateData);

      if (Object.keys(updateData).length === 0) {
        console.warn('Nenhum campo válido para atualizar');
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
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

      // Log security event
      console.log('Transaction updated successfully:', { 
        id: data.id, 
        userId: user.id,
        updatedFields: Object.keys(updateData),
        timestamp: new Date().toISOString()
      });
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
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar transação:', error);
        throw error;
      }

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      
      // Log security event
      console.log('Transaction deleted successfully:', { 
        id, 
        userId: user.id,
        timestamp: new Date().toISOString()
      });
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
