
import { useState, useEffect } from 'react';
import { Transaction, FinancialSummary, MonthlyBalance, DailyBalance } from '@/types/financial';

const STORAGE_KEY = 'financas-jk-data';

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTransactions(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
    setLoading(false);
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

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
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    getYearlyData,
    getDailyBalances,
  };
};
