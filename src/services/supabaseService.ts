
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';
import { Category, CreateCategoryInput } from '@/types/category';
import { CreditCard, CreateCreditCardInput } from '@/types/creditCard';

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

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { user_id: string; cartao_id?: string | null }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTransaction(id: string, updates: Partial<Transaction & { cartao_id?: string | null }>) {
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

  // Categories
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createCategory(category: CreateCategoryInput & { user_id: string }) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Credit Cards
  static async getCreditCards() {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createCreditCard(card: CreateCreditCardInput & { user_id: string }) {
    const { data, error } = await supabase
      .from('credit_cards')
      .insert(card)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateCreditCard(id: string, updates: Partial<CreateCreditCardInput>) {
    const { data, error } = await supabase
      .from('credit_cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteCreditCard(id: string) {
    const { error } = await supabase
      .from('credit_cards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Installments
  static async getInstallments() {
    const { data, error } = await supabase
      .from('parcelas_cartao')
      .select('*')
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createInstallments(installments: any[]) {
    const { data, error } = await supabase
      .from('parcelas_cartao')
      .insert(installments)
      .select();
    
    if (error) throw error;
    return data;
  }

  static async updateInstallment(id: string, updates: any) {
    const { data, error } = await supabase
      .from('parcelas_cartao')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Fixed Expenses
  static async getFixedExpenses() {
    const { data, error } = await supabase
      .from('despesas_fixas')
      .select('*')
      .order('proximo_vencimento', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createFixedExpense(expense: any) {
    const { data, error } = await supabase
      .from('despesas_fixas')
      .insert(expense)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateFixedExpense(id: string, updates: any) {
    const { data, error } = await supabase
      .from('despesas_fixas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteFixedExpense(id: string) {
    const { error } = await supabase
      .from('despesas_fixas')
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
    // First get the current profile to ensure we have required fields
    const { data: currentProfile, error: getError } = await supabase
      .from('profiles')
      .select('nome, email')
      .eq('id', userId)
      .single();

    if (getError) throw getError;

    // Prepare the data with required fields
    const profileData = {
      id: userId,
      nome: updates.nome || currentProfile.nome,
      email: updates.email || currentProfile.email,
      ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url })
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id'
      });
    
    if (error) throw error;
  }
}
