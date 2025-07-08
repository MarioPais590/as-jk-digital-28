
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, CreateCreditCardInput } from '@/types/creditCard';
import { useSupabaseAuth } from './useSupabaseAuth';
import { encryptCardNumber, decryptCardNumber, validateCardNumber } from '@/utils/cardSecurity';
import { sanitizeInput } from '@/utils/inputValidation';

export const useSecureCreditCards = () => {
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
        // Decrypt card number for display (will be masked in UI)
        numero_cartao: item.numero_cartao ? decryptCardNumber(item.numero_cartao) : '',
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

    // Validate card number
    const cleanNumber = cardData.numero_cartao?.replace(/\D/g, '') || '';
    if (cleanNumber && !validateCardNumber(cleanNumber)) {
      throw new Error('Número do cartão inválido');
    }

    // Validate required fields
    if (!cardData.nome || cardData.nome.trim() === '') {
      throw new Error('Nome do cartão é obrigatório');
    }

    if (cardData.limite <= 0) {
      throw new Error('Limite deve ser maior que zero');
    }

    try {
      const bin = cleanNumber.slice(0, 6);
      const lastFour = cleanNumber.slice(-4);
      
      // Encrypt card number before storing
      const encryptedCardNumber = cleanNumber ? encryptCardNumber(cleanNumber) : '';

      const { data, error } = await supabase
        .from('credit_cards')
        .insert({
          user_id: user.id,
          nome: sanitizeInput(cardData.nome),
          limite: cardData.limite,
          dia_fechamento: cardData.dia_fechamento,
          dia_vencimento: cardData.dia_vencimento,
          numero_cartao: encryptedCardNumber,
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
        numero_cartao: cleanNumber, // Store decrypted for local use
        valor_proximas_faturas: Number(data.valor_proximas_faturas) || 0,
        custom_color: data.custom_color,
        bin: data.bin,
        last_four: data.last_four,
        limite_disponivel: Number(data.limite_disponivel) || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCreditCards(prev => [...prev, newCard]);
      
      // Log security event
      console.log('Credit card added successfully:', { 
        id: data.id, 
        nome: data.nome,
        userId: user.id,
        timestamp: new Date().toISOString()
      });
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
      const updateData: any = { ...updates };
      
      // Sanitize text inputs
      if (updates.nome) {
        updateData.nome = sanitizeInput(updates.nome);
      }
      
      // Handle card number encryption if updated
      if (updates.numero_cartao) {
        const cleanNumber = updates.numero_cartao.replace(/\D/g, '');
        if (!validateCardNumber(cleanNumber)) {
          throw new Error('Número do cartão inválido');
        }
        updateData.numero_cartao = encryptCardNumber(cleanNumber);
        updateData.bin = cleanNumber.slice(0, 6);
        updateData.last_four = cleanNumber.slice(-4);
      }

      const { data, error } = await supabase
        .from('credit_cards')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
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
                numero_cartao: data.numero_cartao ? decryptCardNumber(data.numero_cartao) : '',
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

      // Log security event
      console.log('Credit card updated successfully:', { 
        id: data.id, 
        userId: user.id,
        updatedFields: Object.keys(updateData),
        timestamp: new Date().toISOString()
      });
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
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar cartão:', error);
        throw error;
      }

      setCreditCards(prev => prev.filter(card => card.id !== id));
      
      // Log security event
      console.log('Credit card deleted successfully:', { 
        id, 
        userId: user.id,
        timestamp: new Date().toISOString()
      });
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
