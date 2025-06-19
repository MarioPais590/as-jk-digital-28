
import { Transaction, FinancialSummary, MonthlyBalance, DailyBalance } from '@/types/financial';

export const useFinancialReports = (transactions: Transaction[]) => {
  const getMonthlyData = (year: number, month: number): FinancialSummary => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const totalEntradas = monthTransactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSaidas = monthTransactions
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalEntradas,
      totalSaidas,
      saldoAtual: totalEntradas - totalSaidas,
      transacoesCount: monthTransactions.length,
    };
  };

  const getYearlyData = (year: number): MonthlyBalance[] => {
    const monthlyData: MonthlyBalance[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });

      const entradas = monthTransactions
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);

      const saidas = monthTransactions
        .filter(t => t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: new Date(year, month).toLocaleString('pt-BR', { month: 'short' }),
        year,
        entradas,
        saidas,
        saldo: entradas - saidas,
      });
    }

    return monthlyData;
  };

  const getDailyBalances = (year: number, month: number): DailyBalance[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyBalances: DailyBalance[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      const entradas = dayTransactions
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);
      const saidas = dayTransactions
        .filter(t => t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);

      dailyBalances.push({
        date: dateStr,
        balance: entradas - saidas,
      });
    }

    return dailyBalances;
  };

  return {
    getMonthlyData,
    getYearlyData,
    getDailyBalances
  };
};
