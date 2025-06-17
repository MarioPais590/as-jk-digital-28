
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/types/financial';

// Register the autoTable plugin
const jsPDFWithAutoTable = jsPDF as any;

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
      const doc = new jsPDF() as any;
      
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

  const addHeaderToPDF = async (doc: any) => {
    try {
      const logoUrl = '/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png';
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = logoUrl;
      });

      // Logo positioned similar to your example
      doc.addImage(
        logoImg, 
        'PNG', 
        20, 
        15, 
        40, 
        40
      );
    } catch (error) {
      console.warn('Failed to load logo for PDF');
    }

    // Main title - positioned next to logo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Finanças JK', 70, 30);
    
    // Subtitle with generation date
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Relatório gerado em ${currentDate}`, 70, 42);

    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo Financeiro', 20, 70);
  };

  const addFinancialSummarySection = (
    doc: any,
    startY: number,
    totalEntradas: number,
    totalSaidas: number,
    saldoFinal: number,
    transactionsCount: number
  ) => {
    const summaryData = [
      ['Total de Entradas', `R$ ${totalEntradas.toFixed(2).replace('.', ',')}`],
      ['Total de Saídas', `R$ ${totalSaidas.toFixed(2).replace('.', ',')}`],
      ['Saldo Final', `R$ ${saldoFinal.toFixed(2).replace('.', ',')}`],
      ['Total de Transações', transactionsCount.toString()]
    ];

    autoTable(doc, {
      startY,
      head: [['Descrição', 'Valor']],
      body: summaryData,
      styles: { 
        fontSize: 11,
        textColor: [60, 60, 60],
        cellPadding: 8
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 100 },
        1: { halign: 'right', cellWidth: 80, fontStyle: 'bold' }
      },
      margin: { left: 20, right: 20 },
      didParseCell: function(data: any) {
        if (data.column.index === 1 && data.cell.section === 'body') {
          if (data.row.index === 0) { // Entradas
            data.cell.styles.textColor = [22, 163, 74]; // Green
          } else if (data.row.index === 1) { // Saídas
            data.cell.styles.textColor = [220, 38, 38]; // Red
          } else if (data.row.index === 2) { // Saldo Final
            const color = saldoFinal >= 0 ? [22, 163, 74] : [220, 38, 38];
            data.cell.styles.textColor = color;
          }
        }
      }
    });

    return (doc as any).lastAutoTable.finalY + 20;
  };

  const addTransactionsTitle = (doc: any, startY: number) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Detalhamento das Transações', 20, startY);
    
    return startY + 15;
  };

  const generateTransactionTable = (
    doc: any,
    transactions: Transaction[],
    startY: number
  ) => {
    if (transactions.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Nenhuma transação encontrada', 20, startY);
      return startY + 20;
    }

    // Sort transactions by date (most recent first)
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const tableData = sortedTransactions.map(transaction => [
      new Date(transaction.date).toLocaleDateString('pt-BR'),
      transaction.type === 'entrada' ? 'Entrada' : 'Saída',
      transaction.category,
      transaction.description,
      `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`,
      transaction.notes || '-'
    ]);

    autoTable(doc, {
      startY,
      head: [['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Observações']],
      body: tableData,
      styles: { 
        fontSize: 9,
        textColor: [60, 60, 60],
        cellPadding: 6
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 25 }, // Data
        1: { halign: 'center', cellWidth: 20 }, // Tipo
        2: { halign: 'left', cellWidth: 30 },   // Categoria
        3: { halign: 'left', cellWidth: 40 },   // Descrição
        4: { halign: 'right', cellWidth: 25 },  // Valor
        5: { halign: 'left', cellWidth: 'auto' } // Observações
      },
      alternateRowStyles: { 
        fillColor: [245, 245, 245]
      },
      margin: { left: 20, right: 20 },
      didParseCell: function(data: any) {
        const rowIndex = data.row.index;
        const transaction = sortedTransactions[rowIndex];
        
        if (data.column.index === 1 && data.cell.section === 'body') {
          // Color code the transaction type
          if (transaction?.type === 'entrada') {
            data.cell.styles.textColor = [22, 163, 74]; // Green
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [220, 38, 38]; // Red
            data.cell.styles.fontStyle = 'bold';
          }
        }
        
        if (data.column.index === 4 && data.cell.section === 'body') {
          // Color code the amount
          if (transaction?.type === 'entrada') {
            data.cell.styles.textColor = [22, 163, 74]; // Green
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [220, 38, 38]; // Red
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    return (doc as any).lastAutoTable.finalY;
  };

  const addFooterToPDF = (doc: any) => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Página 1 de 1 - Finanças JK`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  };

  const generateFallbackPDF = (
    totalEntradas: number,
    totalSaidas: number,
    saldoFinal: number
  ) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(22, 163, 74);
    doc.text('Finanças JK - Resumo Financeiro', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });
    
    let yPosition = 50;
    
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
    
    doc.setTextColor(232, 192, 6);
    doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 10);
    
    const saldoColor = saldoFinal >= 0 ? [22, 163, 74] : [220, 38, 38];
    doc.setTextColor(...saldoColor);
    doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, yPosition + 20);
    
    doc.save('financas-jk-resumo-fallback.pdf');
  };

  return {
    generateFinancialPDF,
    isGenerating
  };
};
