
import { Transaction } from '@/types/financial';

export const useFinancialCalculations = (transactions: Transaction[]) => {
  const totalEntradas = transactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaidas = transactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoFinal = totalEntradas - totalSaidas;

  return {
    totalEntradas,
    totalSaidas,
    saldoFinal
  };
};
