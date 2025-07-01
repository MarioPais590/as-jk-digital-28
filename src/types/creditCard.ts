export interface CreditCard {
  id: string;
  user_id: string;
  nome: string;
  limite: number;
  dia_fechamento: number;
  dia_vencimento: number;
  numero_cartao?: string;
  valor_proximas_faturas?: number;
  bin?: string;
  last_four?: string;
  limite_disponivel?: number;
  custom_color?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCreditCardInput {
  nome: string;
  limite: number;
  dia_fechamento: number;
  dia_vencimento: number;
  numero_cartao?: string;
  valor_proximas_faturas?: number;
  custom_color?: string;
}

export interface CreditCardUsage {
  card: CreditCard;
  faturaAtual: number;
  percentualUsado: number;
  proximoVencimento: Date;
  proximoFechamento: Date;
  limiteDisponivel: number;
}
