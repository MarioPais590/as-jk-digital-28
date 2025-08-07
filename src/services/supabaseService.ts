// Re-export all services from a single entry point for backward compatibility
export { TransactionService } from './transactionService';
export { CategoryService } from './categoryService';
export { CreditCardService } from './creditCardService';
export { InstallmentService } from './installmentService';
export { ProfileService } from './profileService';

// Legacy SupabaseService class for backward compatibility
import { TransactionService } from './transactionService';
import { CategoryService } from './categoryService';
import { CreditCardService } from './creditCardService';
import { InstallmentService } from './installmentService';
import { ProfileService } from './profileService';

export class SupabaseService {
  // Transactions
  static async getTransactions() {
    return TransactionService.getTransactions(''); // Note: This method needs user_id, keeping for compatibility
  }

  static async createTransaction(transaction: any) {
    return TransactionService.createTransaction(transaction);
  }

  static async updateTransaction(id: string, updates: any) {
    return TransactionService.updateTransaction(id, '', updates); // Note: This method needs user_id
  }

  static async deleteTransaction(id: string) {
    return TransactionService.deleteTransaction(id, ''); // Note: This method needs user_id
  }

  // Categories
  static async getCategories() {
    return CategoryService.getCategories();
  }

  static async createCategory(category: any) {
    return CategoryService.createCategory(category);
  }

  static async deleteCategory(id: string) {
    return CategoryService.deleteCategory(id);
  }

  // Credit Cards
  static async getCreditCards() {
    return CreditCardService.getCreditCards(''); // Note: This method needs user_id
  }

  static async createCreditCard(card: any) {
    return CreditCardService.createCreditCard(card);
  }

  static async updateCreditCard(id: string, updates: any) {
    return CreditCardService.updateCreditCard(id, '', updates); // Note: This method needs user_id
  }

  static async deleteCreditCard(id: string) {
    return CreditCardService.deleteCreditCard(id, ''); // Note: This method needs user_id
  }

  // Installments
  static async getInstallments() {
    return InstallmentService.getInstallments(''); // Note: This method needs user_id
  }

  static async createInstallments(installments: any[]) {
    // This method would need to be adapted to use the new service
    throw new Error('Method deprecated - use InstallmentService.createInstallmentPurchase');
  }

  static async updateInstallment(id: string, updates: any) {
    return InstallmentService.updateInstallment(id, '', updates); // Note: This method needs user_id
  }

  // Profiles
  static async getProfile(userId: string) {
    return ProfileService.getProfile(userId);
  }

  static async updateProfile(userId: string, updates: any) {
    return ProfileService.updateProfile(userId, updates);
  }

  // Fixed Expenses - keeping original implementation for now
  static async getFixedExpenses() {
    const { data, error } = await import('@/integrations/supabase/client').then(m => m.supabase)
      .from('despesas_fixas')
      .select('*')
      .order('proximo_vencimento', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createFixedExpense(expense: any) {
    const { data, error } = await import('@/integrations/supabase/client').then(m => m.supabase)
      .from('despesas_fixas')
      .insert(expense)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateFixedExpense(id: string, updates: any) {
    const { data, error } = await import('@/integrations/supabase/client').then(m => m.supabase)
      .from('despesas_fixas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteFixedExpense(id: string) {
    const { error } = await import('@/integrations/supabase/client').then(m => m.supabase)
      .from('despesas_fixas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
