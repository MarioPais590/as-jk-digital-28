
-- Primeiro, vamos criar a tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  preferencia_tema TEXT DEFAULT 'claro' CHECK (preferencia_tema IN ('claro', 'escuro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Tabela de transações (unificando entradas e saídas)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
  amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_type ON public.transactions(type);

-- Tabela de relatórios mensais (cache de dados calculados)
CREATE TABLE public.monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL CHECK (ano > 1900),
  total_entradas NUMERIC(15,2) DEFAULT 0,
  total_saidas NUMERIC(15,2) DEFAULT 0,
  saldo NUMERIC(15,2) DEFAULT 0,
  transacoes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, mes, ano)
);

-- Criar índices para melhor performance
CREATE INDEX idx_monthly_reports_user_id ON public.monthly_reports(user_id);
CREATE INDEX idx_monthly_reports_ano_mes ON public.monthly_reports(ano, mes);

-- Tabela de relatórios anuais (cache de dados calculados)
CREATE TABLE public.yearly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL CHECK (ano > 1900),
  total_entradas NUMERIC(15,2) DEFAULT 0,
  total_saidas NUMERIC(15,2) DEFAULT 0,
  saldo NUMERIC(15,2) DEFAULT 0,
  transacoes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, ano)
);

-- Criar índices para melhor performance
CREATE INDEX idx_yearly_reports_user_id ON public.yearly_reports(user_id);
CREATE INDEX idx_yearly_reports_ano ON public.yearly_reports(ano);

-- Habilitar Row Level Security (RLS) em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yearly_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para a tabela profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para a tabela transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para a tabela monthly_reports
CREATE POLICY "Users can view own monthly reports" ON public.monthly_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monthly reports" ON public.monthly_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own monthly reports" ON public.monthly_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own monthly reports" ON public.monthly_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para a tabela yearly_reports
CREATE POLICY "Users can view own yearly reports" ON public.yearly_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own yearly reports" ON public.yearly_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own yearly reports" ON public.yearly_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own yearly reports" ON public.yearly_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar campo updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_transactions
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_monthly_reports
  BEFORE UPDATE ON public.monthly_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_yearly_reports
  BEFORE UPDATE ON public.yearly_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
