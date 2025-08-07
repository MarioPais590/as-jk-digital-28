
import { Transaction } from '@/types/financial';
import { useSupabaseAuth } from './useSupabaseAuth';
import { TransactionService } from '@/services/transactionService';
import { ErrorHandler } from '@/utils/errorHandler';

export const useTransactionMutations = (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  const { user } = useSupabaseAuth();

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { cartao_id?: string }) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const data = await TransactionService.createTransaction({
        user_id: user.id,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        description: transaction.description,
        notes: transaction.notes,
        cartao_id: transaction.cartao_id || null
      });

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
      ErrorHandler.handleAsyncError('Erro ao adicionar transação')(error);
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

      if (Object.keys(updateData).length === 0) {
        console.warn('Nenhum campo válido para atualizar');
        return;
      }

      const data = await TransactionService.updateTransaction(id, user.id, updateData);

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
      ErrorHandler.handleAsyncError('Erro ao atualizar transação')(error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await TransactionService.deleteTransaction(id, user.id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao deletar transação')(error);
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
