
import React from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';
import { FinancialSummaryHeader } from '@/components/FinancialSummary/FinancialSummaryHeader';
import { FinancialSummaryCards } from '@/components/FinancialSummary/FinancialSummaryCards';
import { TransactionsTable } from '@/components/FinancialSummary/TransactionsTable';

export const ResumoFinanceiro: React.FC = () => {
  const { transactions } = useFinancialData();
  const { generateFinancialPDF, isGenerating } = usePDFGenerator();
  const { totalEntradas, totalSaidas, saldoFinal } = useFinancialCalculations(transactions);

  const handleExportPDF = () => {
    generateFinancialPDF(transactions, totalEntradas, totalSaidas, saldoFinal);
  };

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
