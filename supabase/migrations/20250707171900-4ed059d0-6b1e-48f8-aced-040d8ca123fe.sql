-- Remove a constraint existente que impede valores zero
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_amount_check;

-- Adiciona nova constraint que permite valores zero ou positivos
ALTER TABLE public.transactions ADD CONSTRAINT transactions_amount_check CHECK (amount >= 0);