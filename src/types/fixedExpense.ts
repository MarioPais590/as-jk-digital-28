
export interface FixedExpense {
  id: string;
  user_id: string;
  nome: string;
  categoria: string;
  valor: number;
  dia_vencimento: number;
  ativa: boolean;
  ultimo_pagamento?: string;
  proximo_vencimento: string;
  status: 'pendente' | 'paga' | 'atrasada';
  created_at: string;
  updated_at: string;
}

export interface CreateFixedExpenseInput {
  nome: string;
  categoria: string;
  valor: number;
  dia_vencimento: number;
  ativa?: boolean;
}
