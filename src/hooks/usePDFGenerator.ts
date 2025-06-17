
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '@/types/financial';
import { addHeaderToPDF, addFinancialSummarySection, addTransactionsTitle, addFooterToPDF } from '@/utils/pdfLayoutGenerator';
import { generateTransactionTable } from '@/utils/pdfTableGenerator';
import { generateFallbackPDF } from '@/utils/pdfFallback';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFinancialPDF = async (
    transactions: Transaction[],
    totalEntradas: number,
    totalSaidas: number,
    saldoFinal: number
  ) => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Add header with logo and title
      await addHeaderToPDF(doc);

      // Add financial summary section
      const summaryEndY = addFinancialSummarySection(
        doc, 
        85, 
        totalEntradas, 
        totalSaidas, 
        saldoFinal, 
        transactions.length
      );

      // Add transactions section title
      const transactionsTitleY = addTransactionsTitle(doc, summaryEndY);

      // Generate transaction table
      const tableEndY = generateTransactionTable(doc, transactions, transactionsTitleY);

      // Add footer
      addFooterToPDF(doc);

      // Save PDF with custom filename
      const fileName = `financas-jk-resumo-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Use fallback PDF generation
      generateFallbackPDF(totalEntradas, totalSaidas, saldoFinal);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateFinancialPDF,
    isGenerating
  };
};
