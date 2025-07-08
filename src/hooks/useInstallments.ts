
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Installment, CreateInstallmentInput, InstallmentGroup } from '@/types/installment';
import { useSupabaseAuth } from './useSupabaseAuth';
import { v4 as uuidv4 } from 'uuid';
import { addMonths, format } from 'date-fns';

export const useInstallments = () => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadInstallments = async () => {
    if (authLoading || !isAuthenticated || !user) {
      setInstallments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('parcelas_cartao')
        .select('*')
        .order('data_vencimento', { ascending: true });

      if (error) {
        console.error('Erro ao carregar parcelas:', error);
        return;
      }

      const formattedInstallments: Installment[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        cartao_id: item.cartao_id,
        compra_id: item.compra_id,
        descricao: item.descricao,
        valor_total: Number(item.valor_total),
        parcelas_totais: item.parcelas_totais,
        numero_parcela: item.numero_parcela,
        valor_parcela: Number(item.valor_parcela),
        data_compra: item.data_compra,
        data_vencimento: item.data_vencimento,
        status: item.status as 'pendente' | 'paga',
        transaction_id: item.transaction_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setInstallments(formattedInstallments);
    } catch (error) {
      console.error('Erro ao carregar parcelas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInstallmentPurchase = async (input: CreateInstallmentInput) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const compra_id = uuidv4();
    const valor_parcela = input.valor_total / input.parcelas_totais;
    const dataCompra = new Date(input.data_compra);

    const installmentsToCreate = [];
    
    for (let i = 1; i <= input.parcelas_totais; i++) {
      const dataVencimento = addMonths(dataCompra, i);
      
      installmentsToCreate.push({
        user_id: user.id,
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

    try {
      const { data, error } = await supabase
        .from('parcelas_cartao')
        .insert(installmentsToCreate)
        .select();

      if (error) {
        console.error('Erro ao criar parcelas:', error);
        throw error;
      }

      await loadInstallments();
      return data;
    } catch (error) {
      console.error('Erro ao criar parcelas:', error);
      throw error;
    }
  };

  const markInstallmentAsPaid = async (installmentId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const installment = installments.find(i => i.id === installmentId);
      if (!installment) {
        throw new Error('Parcela não encontrada');
      }

      // Criar transação para a parcela paga
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'saida',
          amount: installment.valor_parcela,
          date: format(new Date(), 'yyyy-MM-dd'),
          category: 'Cartão de Crédito',
          description: `${installment.descricao} - Parcela ${installment.numero_parcela}/${installment.parcelas_totais}`,
          cartao_id: installment.cartao_id
        })
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      // Atualizar parcela como paga
      const { error: updateError } = await supabase
        .from('parcelas_cartao')
        .update({
          status: 'paga',
          transaction_id: transactionData.id
        })
        .eq('id', installmentId);

      if (updateError) {
        throw updateError;
      }

      await loadInstallments();
    } catch (error) {
      console.error('Erro ao marcar parcela como paga:', error);
      throw error;
    }
  };

  const getInstallmentGroups = (): InstallmentGroup[] => {
    const groups: { [key: string]: InstallmentGroup } = {};

    installments.forEach(installment => {
      if (!groups[installment.compra_id]) {
        groups[installment.compra_id] = {
          compra_id: installment.compra_id,
          descricao: installment.descricao,
          valor_total: installment.valor_total,
          parcelas_totais: installment.parcelas_totais,
          parcelas_pagas: 0,
          parcelas: []
        };
      }

      groups[installment.compra_id].parcelas.push(installment);
      
      if (installment.status === 'paga') {
        groups[installment.compra_id].parcelas_pagas++;
      }
    });

    return Object.values(groups);
  };

  useEffect(() => {
    if (!authLoading) {
      loadInstallments();
    }
  }, [isAuthenticated, user, authLoading]);

  return {
    installments,
    loading: loading || authLoading,
    createInstallmentPurchase,
    markInstallmentAsPaid,
    getInstallmentGroups,
    refreshInstallments: loadInstallments
  };
};
