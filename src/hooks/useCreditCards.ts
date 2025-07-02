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
        limite: Number(item.limite) || 0,
        dia_fechamento: item.dia_fechamento,
        dia_vencimento: item.dia_vencimento,
        numero_cartao: item.numero_cartao || '',
        valor_proximas_faturas: Number(item.valor_proximas_faturas) || 0,
        bin: item.bin,
        last_four: item.last_four,
        limite_disponivel: Number(item.limite_disponivel) || 0,
        custom_color: item.custom_color,
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
      // Extrair BIN e últimos 4 dígitos do número do cartão
      const cleanNumber = cardData.numero_cartao?.replace(/\D/g, '') || '';
      const bin = cleanNumber.slice(0, 6);
      const lastFour = cleanNumber.slice(-4);

      const { data, error } = await supabase
        .from('credit_cards')
        .insert({
          user_id: user.id,
          nome: cardData.nome,
          limite: cardData.limite,
          dia_fechamento: cardData.dia_fechamento,
          dia_vencimento: cardData.dia_vencimento,
          numero_cartao: cleanNumber,
          valor_proximas_faturas: cardData.valor_proximas_faturas || 0,
          custom_color: cardData.custom_color,
          bin: bin,
          last_four: lastFour,
          limite_disponivel: cardData.limite
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
        numero_cartao: data.numero_cartao || '',
        valor_proximas_faturas: Number(data.valor_proximas_faturas) || 0,
        custom_color: data.custom_color,
        bin: data.bin,
        last_four: data.last_four,
        limite_disponivel: Number(data.limite_disponivel) || 0,
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
      // Extrair BIN e últimos 4 dígitos se o número do cartão foi atualizado
      const updateData: any = { ...updates };
      if (updates.numero_cartao) {
        const cleanNumber = updates.numero_cartao.replace(/\D/g, '');
        updateData.numero_cartao = cleanNumber;
        updateData.bin = cleanNumber.slice(0, 6);
        updateData.last_four = cleanNumber.slice(-4);
      }

      const { data, error } = await supabase
        .from('credit_cards')
        .update(updateData)
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
                numero_cartao: data.numero_cartao || '',
                valor_proximas_faturas: Number(data.valor_proximas_faturas) || 0,
                custom_color: data.custom_color,
                bin: data.bin,
                last_four: data.last_four,
                limite_disponivel: Number(data.limite_disponivel) || 0,
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
