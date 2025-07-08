
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FixedExpense, CreateFixedExpenseInput } from '@/types/fixedExpense';
import { useSupabaseAuth } from './useSupabaseAuth';
import { format, addMonths, isBefore, addDays } from 'date-fns';

export const useFixedExpenses = () => {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadFixedExpenses = async () => {
    if (authLoading || !isAuthenticated || !user) {
      setFixedExpenses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('despesas_fixas')
        .select('*')
        .order('proximo_vencimento', { ascending: true });

      if (error) {
        console.error('Erro ao carregar despesas fixas:', error);
        return;
      }

      const formattedExpenses: FixedExpense[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        nome: item.nome,
        categoria: item.categoria,
        valor: Number(item.valor),
        dia_vencimento: item.dia_vencimento,
        ativa: item.ativa,
        ultimo_pagamento: item.ultimo_pagamento,
        proximo_vencimento: item.proximo_vencimento,
        status: item.status as 'pendente' | 'paga' | 'atrasada',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setFixedExpenses(formattedExpenses);
    } catch (error) {
      console.error('Erro ao carregar despesas fixas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFixedExpense = async (input: CreateFixedExpenseInput) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const now = new Date();
    const proximoVencimento = new Date(now.getFullYear(), now.getMonth(), input.dia_vencimento);
    
    // Se a data já passou este mês, ir para o próximo mês
    if (proximoVencimento <= now) {
      proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
    }

    try {
      const { data, error } = await supabase
        .from('despesas_fixas')
        .insert({
          user_id: user.id,
          nome: input.nome,
          categoria: input.categoria,
          valor: input.valor,
          dia_vencimento: input.dia_vencimento,
          ativa: input.ativa ?? true,
          proximo_vencimento: format(proximoVencimento, 'yyyy-MM-dd'),
          status: 'pendente'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      await loadFixedExpenses();
      return data;
    } catch (error) {
      console.error('Erro ao criar despesa fixa:', error);
      throw error;
    }
  };

  const markExpenseAsPaid = async (expenseId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const expense = fixedExpenses.find(e => e.id === expenseId);
      if (!expense) {
        throw new Error('Despesa não encontrada');
      }

      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Criar transação para a despesa paga
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'saida',
          amount: expense.valor,
          date: today,
          category: expense.categoria,
          description: expense.nome,
          notes: 'Despesa fixa paga automaticamente'
        })
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      // Calcular próximo vencimento
      const proximoVencimento = addMonths(new Date(expense.proximo_vencimento), 1);

      // Atualizar despesa como paga e definir próximo vencimento
      const { error: updateError } = await supabase
        .from('despesas_fixas')
        .update({
          status: 'paga',
          ultimo_pagamento: today,
          proximo_vencimento: format(proximoVencimento, 'yyyy-MM-dd')
        })
        .eq('id', expenseId);

      if (updateError) {
        throw updateError;
      }

      await loadFixedExpenses();
    } catch (error) {
      console.error('Erro ao marcar despesa como paga:', error);
      throw error;
    }
  };

  const updateFixedExpense = async (id: string, updates: Partial<CreateFixedExpenseInput>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('despesas_fixas')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await loadFixedExpenses();
    } catch (error) {
      console.error('Erro ao atualizar despesa fixa:', error);
      throw error;
    }
  };

  const deleteFixedExpense = async (id: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('despesas_fixas')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await loadFixedExpenses();
    } catch (error) {
      console.error('Erro ao deletar despesa fixa:', error);
      throw error;
    }
  };

  const getOverdueExpenses = () => {
    const today = new Date();
    const overdueThreshold = addDays(today, -3);

    return fixedExpenses.filter(expense => {
      const vencimento = new Date(expense.proximo_vencimento);
      return expense.status === 'pendente' && isBefore(vencimento, overdueThreshold);
    });
  };

  useEffect(() => {
    if (!authLoading) {
      loadFixedExpenses();
    }
  }, [isAuthenticated, user, authLoading]);

  return {
    fixedExpenses,
    loading: loading || authLoading,
    createFixedExpense,
    markExpenseAsPaid,
    updateFixedExpense,
    deleteFixedExpense,
    getOverdueExpenses,
    refreshFixedExpenses: loadFixedExpenses
  };
};
