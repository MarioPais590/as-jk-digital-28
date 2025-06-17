
import React from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { FinancialSummaryHeader } from '@/components/FinancialSummary/FinancialSummaryHeader';
import { FinancialSummaryCards } from '@/components/FinancialSummary/FinancialSummaryCards';
import { TransactionsTable } from '@/components/FinancialSummary/TransactionsTable';

export const ResumoFinanceiro: React.FC = () => {
  const { transactions } = useFinancialData();
  const { generateFinancialPDF, isGenerating } = usePDFGenerator();

  // Calcular totais
  const totalEntradas = transactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaidas = transactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoFinal = totalEntradas - totalSaidas;

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
