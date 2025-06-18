
import React from 'react';
import { useSupabaseFinancialData } from '@/hooks/useSupabaseFinancialData';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';
import { FinancialSummaryHeader } from '@/components/FinancialSummary/FinancialSummaryHeader';
import { FinancialSummaryCards } from '@/components/FinancialSummary/FinancialSummaryCards';
import { TransactionsTable } from '@/components/FinancialSummary/TransactionsTable';

export const ResumoFinanceiro: React.FC = () => {
  const { transactions, loading } = useSupabaseFinancialData();
  const { generateFinancialPDF, isGenerating } = usePDFGenerator();
  const { totalEntradas, totalSaidas, saldoFinal } = useFinancialCalculations(transactions);

  const handleExportPDF = () => {
    generateFinancialPDF(transactions, totalEntradas, totalSaidas, saldoFinal);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando resumo financeiro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FinancialSummaryHeader 
        onExportPDF={handleExportPDF}
        isGenerating={isGenerating}
      />

      <FinancialSummaryCards
        totalEntradas={totalEntradas}
        totalSaidas={totalSaidas}
        saldoFinal={saldoFinal}
      />

      <TransactionsTable transactions={transactions} />
    </div>
  );
};
