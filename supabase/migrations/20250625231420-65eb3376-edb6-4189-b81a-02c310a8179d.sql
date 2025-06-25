
-- Verificar se a tabela categories já existe, se não, criar
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
        -- Criar tabela de categorias
        CREATE TABLE public.categories (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
            is_default BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );

        -- Habilitar RLS
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

        -- Criar políticas RLS
        CREATE POLICY "Users can view own categories" ON public.categories
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own categories" ON public.categories
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update own categories" ON public.categories
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete own categories" ON public.categories
            FOR DELETE USING (auth.uid() = user_id);

        -- Criar trigger para updated_at
        CREATE TRIGGER categories_updated_at
            BEFORE UPDATE ON public.categories
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();

        -- Criar trigger para categorias padrão
        CREATE TRIGGER categories_after_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION handle_new_user_categories();
    END IF;
END $$;
