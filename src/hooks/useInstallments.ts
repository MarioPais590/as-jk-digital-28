
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Installment, CreateInstallmentInput, InstallmentGroup } from '@/types/installment';
import { useSupabaseAuth } from './useSupabaseAuth';
import { v4 as uuidv4 } from 'uuid';
import { addMonths, format } from 'date-fns';

export const useInstallments = () => {
  console.log('useInstallments: Hook initializing');
  
  const [installments, setInstallments] = React.useState<Installment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadInstallments = React.useCallback(async () => {
    if (authLoading || !isAuthenticated || !user) {
      console.log('useInstallments: Auth not ready, skipping load');
      setInstallments([]);
      setLoading(false);
      return;
    }

    try {
      console.log('useInstallments: Loading installments for user:', user.id);
      
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

      console.log('useInstallments: Loaded', formattedInstallments.length, 'installments');
      setInstallments(formattedInstallments);
    } catch (error) {
      console.error('Erro ao carregar parcelas:', error);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user]);

  const createInstallmentPurchase = React.useCallback(async (input: CreateInstallmentInput) => {
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
  }, [user, loadInstallments]);

  const markInstallmentAsPaid = React.useCallback(async (installmentId: string) => {
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

      // Sincronizar com cartão de crédito - atualizar valor das próximas faturas
      const { data: cardData, error: cardError } = await supabase
        .from('credit_cards')
        .select('valor_proximas_faturas, limite')
        .eq('id', installment.cartao_id)
        .single();

      if (!cardError && cardData) {
        const novoValorFaturas = Math.max(0, (cardData.valor_proximas_faturas || 0) - installment.valor_parcela);
        const novoLimiteDisponivel = cardData.limite - novoValorFaturas;

        await supabase
          .from('credit_cards')
          .update({
            valor_proximas_faturas: novoValorFaturas,
            limite_disponivel: novoLimiteDisponivel
          })
          .eq('id', installment.cartao_id);
      }

      await loadInstallments();
    } catch (error) {
      console.error('Erro ao marcar parcela como paga:', error);
      throw error;
    }
  }, [user, installments, loadInstallments]);

  const markInstallmentAsPending = React.useCallback(async (installmentId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const installment = installments.find(i => i.id === installmentId);
      if (!installment || installment.status !== 'paga') {
        throw new Error('Parcela não encontrada ou não está paga');
      }

      // Remover transação associada se existir
      if (installment.transaction_id) {
        const { error: deleteTransactionError } = await supabase
          .from('transactions')
          .delete()
          .eq('id', installment.transaction_id);

        if (deleteTransactionError) {
          throw deleteTransactionError;
        }
      }

      // Atualizar parcela como pendente
      const { error: updateError } = await supabase
        .from('parcelas_cartao')
        .update({
          status: 'pendente',
          transaction_id: null
        })
        .eq('id', installmentId);

      if (updateError) {
        throw updateError;
      }

      // Sincronizar com cartão de crédito - adicionar valor de volta às próximas faturas
      const { data: cardData, error: cardError } = await supabase
        .from('credit_cards')
        .select('valor_proximas_faturas, limite')
        .eq('id', installment.cartao_id)
        .single();

      if (!cardError && cardData) {
        const novoValorFaturas = (cardData.valor_proximas_faturas || 0) + installment.valor_parcela;
        const novoLimiteDisponivel = cardData.limite - novoValorFaturas;

        await supabase
          .from('credit_cards')
          .update({
            valor_proximas_faturas: novoValorFaturas,
            limite_disponivel: novoLimiteDisponivel
          })
          .eq('id', installment.cartao_id);
      }

      await loadInstallments();
    } catch (error) {
      console.error('Erro ao desmarcar parcela como paga:', error);
      throw error;
    }
  }, [user, installments, loadInstallments]);

  const updateInstallmentPurchase = React.useCallback(async (compraId: string, updates: { descricao?: string; valor_total?: number }) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const installmentsToUpdate = installments.filter(i => i.compra_id === compraId);
      if (installmentsToUpdate.length === 0) {
        throw new Error('Compra não encontrada');
      }

      const updateData: any = {};
      if (updates.descricao) {
        updateData.descricao = updates.descricao;
      }
      if (updates.valor_total) {
        updateData.valor_total = updates.valor_total;
        updateData.valor_parcela = updates.valor_total / installmentsToUpdate[0].parcelas_totais;
      }

      const { error } = await supabase
        .from('parcelas_cartao')
        .update(updateData)
        .eq('compra_id', compraId);

      if (error) {
        throw error;
      }

      await loadInstallments();
    } catch (error) {
      console.error('Erro ao atualizar compra:', error);
      throw error;
    }
  }, [user, installments, loadInstallments]);

  const deleteInstallmentPurchase = React.useCallback(async (compraId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const installmentsToDelete = installments.filter(i => i.compra_id === compraId);
      
      // Reverter parcelas pagas e remover transações
      for (const installment of installmentsToDelete) {
        if (installment.status === 'paga') {
          await markInstallmentAsPending(installment.id);
        }
      }

      // Deletar todas as parcelas da compra
      const { error } = await supabase
        .from('parcelas_cartao')
        .delete()
        .eq('compra_id', compraId);

      if (error) {
        throw error;
      }

      await loadInstallments();
    } catch (error) {
      console.error('Erro ao deletar compra:', error);
      throw error;
    }
  }, [user, installments, markInstallmentAsPending, loadInstallments]);

  const getInstallmentGroups = React.useCallback((): InstallmentGroup[] => {
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
  }, [installments]);

  React.useEffect(() => {
    console.log('useInstallments: useEffect triggered', { authLoading, isAuthenticated, user: user?.id });
    if (!authLoading) {
      loadInstallments();
    }
  }, [loadInstallments, authLoading]);

  return React.useMemo(() => ({
    installments,
    loading: loading || authLoading,
    createInstallmentPurchase,
    markInstallmentAsPaid,
    markInstallmentAsPending,
    updateInstallmentPurchase,
    deleteInstallmentPurchase,
    getInstallmentGroups,
    refreshInstallments: loadInstallments
  }), [
    installments,
    loading,
    authLoading,
    createInstallmentPurchase,
    markInstallmentAsPaid,
    markInstallmentAsPending,
    updateInstallmentPurchase,
    deleteInstallmentPurchase,
    getInstallmentGroups,
    loadInstallments
  ]);
};
