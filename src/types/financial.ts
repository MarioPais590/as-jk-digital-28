
export interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  amount: number;
  date: string;
  category: string;
  description: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyBalance {
  month: string;
  year: number;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface DailyBalance {
  date: string;
  balance: number;
}

export interface FinancialSummary {
  totalEntradas: number;
  totalSaidas: number;
  saldoAtual: number;
  transacoesCount: number;
}
