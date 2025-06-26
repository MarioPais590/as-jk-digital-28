
-- Criar tabela de cartões de crédito
CREATE TABLE public.credit_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  limite NUMERIC NOT NULL DEFAULT 0,
  dia_fechamento INTEGER NOT NULL CHECK (dia_fechamento >= 1 AND dia_fechamento <= 31),
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para cartões de crédito
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para cartões
CREATE POLICY "Users can view their own credit cards" 
  ON public.credit_cards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credit cards" 
  ON public.credit_cards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit cards" 
  ON public.credit_cards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credit cards" 
  ON public.credit_cards 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Adicionar campo cartao_id na tabela transactions
ALTER TABLE public.transactions 
ADD COLUMN cartao_id UUID REFERENCES public.credit_cards(id) ON DELETE SET NULL;

-- Trigger para updated_at nos cartões
CREATE TRIGGER handle_updated_at_credit_cards 
  BEFORE UPDATE ON public.credit_cards
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
