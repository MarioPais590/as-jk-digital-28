
import { useTransactions } from './useTransactions';
import { useTransactionMutations } from './useTransactionMutations';
import { useFinancialReports } from './useFinancialReports';

export const useSupabaseFinancialData = () => {
  const { transactions, loading, refreshTransactions, setTransactions } = useTransactions();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactionMutations(setTransactions);
  const { getMonthlyData, getYearlyData, getDailyBalances } = useFinancialReports(transactions);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    getYearlyData,
    getDailyBalances,
    refreshTransactions
  };
};
