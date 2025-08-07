
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export class TransactionService {
  static async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { user_id: string; cartao_id?: string | null }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTransaction(id: string, userId: string, updates: Partial<Transaction & { cartao_id?: string | null }>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTransaction(id: string, userId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
}
