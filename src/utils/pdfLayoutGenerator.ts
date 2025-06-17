
import { jsPDF } from 'jspdf';
import { PDF_CONFIG } from './pdfConfig';

export const addHeaderToPDF = async (doc: jsPDF) => {
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

export const addFinancialSummarySection = (
  doc: jsPDF,
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

  doc.autoTable({
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
    didParseCell: function(data) {
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

  return doc.lastAutoTable.finalY + 20;
};

export const addTransactionsTitle = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Detalhamento das Transações', 20, startY);
  
  return startY + 15;
};

export const addFooterToPDF = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Página 1 de 1 - Finanças JK`, pageWidth / 2, pageHeight - 15, { align: 'center' });
};
