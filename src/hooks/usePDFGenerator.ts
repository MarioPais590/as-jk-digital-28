
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '@/types/financial';
import { addHeaderToPDF, addTotalsToPDF, addFooterToPDF } from '@/utils/pdfLayoutGenerator';
import { generateTransactionTable } from '@/utils/pdfTableGenerator';
import { generateFallbackPDF } from '@/utils/pdfFallback';
import { PDF_CONFIG } from '@/utils/pdfConfig';

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

      // Generate transaction table
      const tableEndY = generateTransactionTable(doc, transactions, PDF_CONFIG.layout.tableStartY);

      // Add totals section
      addTotalsToPDF(doc, tableEndY, totalEntradas, totalSaidas, saldoFinal);

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
