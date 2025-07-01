
-- Adicionar coluna numero_cartao à tabela credit_cards
ALTER TABLE public.credit_cards 
ADD COLUMN numero_cartao VARCHAR(16);

-- Atualizar os tipos do Supabase
COMMENT ON COLUMN public.credit_cards.numero_cartao IS 'Número completo do cartão de crédito';
