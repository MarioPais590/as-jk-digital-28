
-- Primeiro, criar uma função para inserir categorias padrão para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user_categories()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir categorias padrão de despesas (saida)
  INSERT INTO public.categories (user_id, name, type, is_default) VALUES
  (NEW.id, 'Moradia', 'saida', true),
  (NEW.id, 'Alimentação', 'saida', true),
  (NEW.id, 'Transporte', 'saida', true),
  (NEW.id, 'Saúde', 'saida', true),
  (NEW.id, 'Educação', 'saida', true),
  (NEW.id, 'Compras', 'saida', true),
  (NEW.id, 'Lazer', 'saida', true),
  (NEW.id, 'Serviços Pessoais', 'saida', true),
  (NEW.id, 'Finanças', 'saida', true),
  (NEW.id, 'Animais de Estimação', 'saida', true),
  (NEW.id, 'Outros', 'saida', true),
  
  -- Categorias padrão de entradas
  (NEW.id, 'Salário', 'entrada', true),
  (NEW.id, 'Freelance', 'entrada', true),
  (NEW.id, 'Vendas', 'entrada', true),
  (NEW.id, 'Investimentos', 'entrada', true),
  (NEW.id, 'Bônus', 'entrada', true),
  (NEW.id, 'Outros', 'entrada', true);
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't block user creation
    RAISE LOG 'Error creating default categories for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Criar trigger para executar a função quando um usuário é criado
CREATE TRIGGER on_auth_user_created_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_categories();
