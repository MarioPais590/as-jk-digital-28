
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Installment, CreateInstallmentInput, InstallmentGroup } from '@/types/installment';
import { useSupabaseAuth } from './useSupabaseAuth';
import { InstallmentService } from '@/services/installmentService';
import { InstallmentBusinessLogic } from '@/utils/installmentBusinessLogic';
import { ErrorHandler } from '@/utils/errorHandler';

export const useInstallments = () => {
  console.log('useInstallments: Hook initializing');
  
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadInstallments = useCallback(async () => {
    if (authLoading || !isAuthenticated || !user) {
      console.log('useInstallments: Auth not ready, skipping load');
      setInstallments([]);
      setLoading(false);
      return;
    }

    try {
      console.log('useInstallments: Loading installments for user:', user.id);
      
      const data = await InstallmentService.getInstallments(user.id);

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
      ErrorHandler.logError('Erro ao carregar parcelas', error);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user]);

  const createInstallmentPurchase = useCallback(async (input: CreateInstallmentInput) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await InstallmentService.createInstallmentPurchase(user.id, input);
      await loadInstallments();
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao criar parcelas')(error);
    }
  }, [user, loadInstallments]);

  const markInstallmentAsPaid = useCallback(async (installmentId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const installment = installments.find(i => i.id === installmentId);
      if (!installment) {
        throw new Error('Parcela não encontrada');
      }

      await InstallmentBusinessLogic.markAsPaid(installment, user.id);
      await loadInstallments();
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao marcar parcela como paga')(error);
    }
  }, [user, installments, loadInstallments]);

  const markInstallmentAsPending = useCallback(async (installmentId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const installment = installments.find(i => i.id === installmentId);
      if (!installment) {
        throw new Error('Parcela não encontrada');
      }

      await InstallmentBusinessLogic.markAsPending(installment, user.id);
      await loadInstallments();
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao desmarcar parcela como paga')(error);
    }
  }, [user, installments, loadInstallments]);

  const updateInstallmentPurchase = useCallback(async (compraId: string, updates: { descricao?: string; valor_total?: number }) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await InstallmentService.updateInstallmentPurchase(compraId, user.id, updates);
      await loadInstallments();
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao atualizar compra')(error);
    }
  }, [user, loadInstallments]);

  const deleteInstallmentPurchase = useCallback(async (compraId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const installmentsToDelete = installments.filter(i => i.compra_id === compraId);
      
      // Reverter parcelas pagas
      for (const installment of installmentsToDelete) {
        if (installment.status === 'paga') {
          await markInstallmentAsPending(installment.id);
        }
      }

      await InstallmentService.deleteInstallmentsByPurchase(compraId, user.id);
      await loadInstallments();
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao deletar compra')(error);
    }
  }, [user, installments, markInstallmentAsPending, loadInstallments]);

  const getInstallmentGroups = useCallback((): InstallmentGroup[] => {
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

  useEffect(() => {
    console.log('useInstallments: useEffect triggered', { authLoading, isAuthenticated, user: user?.id });
    if (!authLoading) {
      loadInstallments();
    }
  }, [loadInstallments, authLoading]);

  return useMemo(() => ({
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
