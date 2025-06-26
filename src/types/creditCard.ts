
export interface CreditCard {
  id: string;
  user_id: string;
  nome: string;
  limite: number;
  dia_fechamento: number;
  dia_vencimento: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCreditCardInput {
  nome: string;
  limite: number;
  dia_fechamento: number;
  dia_vencimento: number;
}

export interface CreditCardUsage {
  card: CreditCard;
  faturaAtual: number;
  percentualUsado: number;
  proximoVencimento: Date;
  proximoFechamento: Date;
}
