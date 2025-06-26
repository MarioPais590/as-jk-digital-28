
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, CreateCreditCardInput } from '@/types/creditCard';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadCreditCards = async () => {
    if (authLoading || !isAuthenticated || !user) {
      setCreditCards([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Loading credit cards for user:', user.id);
      
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar cartões:', error);
        setCreditCards([]);
        return;
      }

      const formattedCards: CreditCard[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        nome: item.nome,
        limite: Number(item.limite),
        dia_fechamento: item.dia_fechamento,
        dia_vencimento: item.dia_vencimento,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setCreditCards(formattedCards);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      setCreditCards([]);
    } finally {
      setLoading(false);
    }
  };

  const addCreditCard = async (cardData: CreateCreditCardInput) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .insert({
          user_id: user.id,
          nome: cardData.nome,
          limite: cardData.limite,
          dia_fechamento: cardData.dia_fechamento,
          dia_vencimento: cardData.dia_vencimento
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar cartão:', error);
        throw error;
      }

      const newCard: CreditCard = {
        id: data.id,
        user_id: data.user_id,
        nome: data.nome,
        limite: Number(data.limite),
        dia_fechamento: data.dia_fechamento,
        dia_vencimento: data.dia_vencimento,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCreditCards(prev => [...prev, newCard]);
    } catch (error) {
      console.error('Erro ao adicionar cartão:', error);
      throw error;
    }
  };

  const updateCreditCard = async (id: string, updates: Partial<CreateCreditCardInput>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cartão:', error);
        throw error;
      }

      setCreditCards(prev =>
        prev.map(card =>
          card.id === id
            ? {
                ...card,
                nome: data.nome,
                limite: Number(data.limite),
                dia_fechamento: data.dia_fechamento,
                dia_vencimento: data.dia_vencimento,
                updated_at: data.updated_at
              }
            : card
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar cartão:', error);
      throw error;
    }
  };

  const deleteCreditCard = async (id: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('credit_cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar cartão:', error);
        throw error;
      }

      setCreditCards(prev => prev.filter(card => card.id !== id));
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadCreditCards();
    }
  }, [isAuthenticated, user, authLoading]);

  return {
    creditCards,
    loading: loading || authLoading,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    refreshCreditCards: loadCreditCards
  };
};
