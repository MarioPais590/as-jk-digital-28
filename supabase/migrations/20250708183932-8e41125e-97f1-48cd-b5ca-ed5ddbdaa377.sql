
-- Criar tabela para parcelas de cartão
CREATE TABLE public.parcelas_cartao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cartao_id UUID NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
  compra_id UUID NOT NULL,
  descricao TEXT NOT NULL,
  valor_total NUMERIC NOT NULL,
  parcelas_totais INTEGER NOT NULL,
  numero_parcela INTEGER NOT NULL,
  valor_parcela NUMERIC NOT NULL,
  data_compra DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga')),
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para despesas fixas
CREATE TABLE public.despesas_fixas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  ativa BOOLEAN NOT NULL DEFAULT true,
  ultimo_pagamento DATE,
  proximo_vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'atrasada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.parcelas_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despesas_fixas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para parcelas_cartao
CREATE POLICY "Users can view their own parcelas_cartao"
  ON public.parcelas_cartao FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own parcelas_cartao"
  ON public.parcelas_cartao FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parcelas_cartao"
  ON public.parcelas_cartao FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own parcelas_cartao"
  ON public.parcelas_cartao FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para despesas_fixas
CREATE POLICY "Users can view their own despesas_fixas"
  ON public.despesas_fixas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own despesas_fixas"
  ON public.despesas_fixas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own despesas_fixas"
  ON public.despesas_fixas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own despesas_fixas"
  ON public.despesas_fixas FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at nas novas tabelas
CREATE TRIGGER handle_updated_at_parcelas_cartao
  BEFORE UPDATE ON public.parcelas_cartao
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_despesas_fixas
  BEFORE UPDATE ON public.despesas_fixas
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Índices para melhor performance
CREATE INDEX idx_parcelas_cartao_user_id ON public.parcelas_cartao(user_id);
CREATE INDEX idx_parcelas_cartao_cartao_id ON public.parcelas_cartao(cartao_id);
CREATE INDEX idx_parcelas_cartao_compra_id ON public.parcelas_cartao(compra_id);
CREATE INDEX idx_parcelas_cartao_status ON public.parcelas_cartao(status);
CREATE INDEX idx_parcelas_cartao_data_vencimento ON public.parcelas_cartao(data_vencimento);

CREATE INDEX idx_despesas_fixas_user_id ON public.despesas_fixas(user_id);
CREATE INDEX idx_despesas_fixas_status ON public.despesas_fixas(status);
CREATE INDEX idx_despesas_fixas_proximo_vencimento ON public.despesas_fixas(proximo_vencimento);
