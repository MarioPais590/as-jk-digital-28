
export interface Installment {
  id: string;
  user_id: string;
  cartao_id: string;
  compra_id: string;
  descricao: string;
  valor_total: number;
  parcelas_totais: number;
  numero_parcela: number;
  valor_parcela: number;
  data_compra: string;
  data_vencimento: string;
  status: 'pendente' | 'paga';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInstallmentInput {
  cartao_id: string;
  descricao: string;
  valor_total: number;
  parcelas_totais: number;
  data_compra: string;
}

export interface InstallmentGroup {
  compra_id: string;
  descricao: string;
  valor_total: number;
  parcelas_totais: number;
  parcelas_pagas: number;
  parcelas: Installment[];
}
