
import { supabase } from '@/integrations/supabase/client';
import { Installment, CreateInstallmentInput } from '@/types/installment';
import { v4 as uuidv4 } from 'uuid';
import { addMonths, format } from 'date-fns';

export class InstallmentService {
  static async getInstallments(userId: string) {
    const { data, error } = await supabase
      .from('parcelas_cartao')
      .select('*')
      .eq('user_id', userId)
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createInstallmentPurchase(userId: string, input: CreateInstallmentInput) {
    const compra_id = uuidv4();
    const valor_parcela = input.valor_total / input.parcelas_totais;
    const dataCompra = new Date(input.data_compra);

    const installmentsToCreate = [];
    
    for (let i = 1; i <= input.parcelas_totais; i++) {
      const dataVencimento = addMonths(dataCompra, i);
      
      installmentsToCreate.push({
        user_id: userId,
        cartao_id: input.cartao_id,
        compra_id,
        descricao: input.descricao,
        valor_total: input.valor_total,
        parcelas_totais: input.parcelas_totais,
        numero_parcela: i,
        valor_parcela,
        data_compra: format(dataCompra, 'yyyy-MM-dd'),
        data_vencimento: format(dataVencimento, 'yyyy-MM-dd'),
        status: 'pendente'
      });
    }

    const { data, error } = await supabase
      .from('parcelas_cartao')
      .insert(installmentsToCreate)
      .select();

    if (error) throw error;
    return data;
  }

  static async updateInstallment(id: string, userId: string, updates: any) {
    const { data, error } = await supabase
      .from('parcelas_cartao')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteInstallmentsByPurchase(compraId: string, userId: string) {
    const { error } = await supabase
      .from('parcelas_cartao')
      .delete()
      .eq('compra_id', compraId)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  static async updateInstallmentPurchase(compraId: string, userId: string, updates: { descricao?: string; valor_total?: number }) {
    const updateData: any = {};
    if (updates.descricao) {
      updateData.descricao = updates.descricao;
    }
    if (updates.valor_total) {
      updateData.valor_total = updates.valor_total;
      // Recalcular valor da parcela baseado no número total
      const { data: installments } = await supabase
        .from('parcelas_cartao')
        .select('parcelas_totais')
        .eq('compra_id', compraId)
        .eq('user_id', userId)
        .limit(1)
        .single();
      
      if (installments) {
        updateData.valor_parcela = updates.valor_total / installments.parcelas_totais;
      }
    }

    const { error } = await supabase
      .from('parcelas_cartao')
      .update(updateData)
      .eq('compra_id', compraId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}
