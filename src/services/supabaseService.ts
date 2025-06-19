
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export class SupabaseService {
  // Transactions
  static async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { user_id: string }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Profiles
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('nome, email, avatar_url')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProfile(userId: string, updates: { nome?: string; email?: string; avatar_url?: string | null }) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId, 
        ...updates 
      }, {
        onConflict: 'id'
      });
    
    if (error) throw error;
  }
}
