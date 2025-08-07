
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, CreateCreditCardInput } from '@/types/creditCard';

export class CreditCardService {
  static async getCreditCards(userId: string) {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', userId)
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

  static async updateCreditCard(id: string, userId: string, updates: Partial<CreateCreditCardInput>) {
    const { data, error } = await supabase
      .from('credit_cards')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteCreditCard(id: string, userId: string) {
    const { error } = await supabase
      .from('credit_cards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
}
