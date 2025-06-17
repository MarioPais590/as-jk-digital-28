
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

    doc.addImage(
      logoImg, 
      'PNG', 
      PDF_CONFIG.layout.logoPosition.x, 
      PDF_CONFIG.layout.logoPosition.y, 
      PDF_CONFIG.layout.logoSize.width, 
      PDF_CONFIG.layout.logoSize.height
    );
  } catch (error) {
    console.warn('Failed to load logo for PDF');
  }

  // Title
  doc.setFontSize(PDF_CONFIG.fonts.title);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Finanças JK - Resumo Financeiro', 105, PDF_CONFIG.layout.titleY, { align: 'center' });
  
  // Subtitle with generation date
  doc.setFontSize(PDF_CONFIG.fonts.subtitle);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PDF_CONFIG.colors.gray);
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Gerado em: ${currentDate}`, 105, PDF_CONFIG.layout.subtitleY, { align: 'center' });
};

export const addTotalsToPDF = (
  doc: jsPDF,
  startY: number,
  totalEntradas: number,
  totalSaidas: number,
  saldoFinal: number
) => {
  const totalY = startY + 20;

  // Totals section title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Resumo dos Totais', 14, totalY);

  // Total entries
  doc.setFontSize(PDF_CONFIG.fonts.normal);
  doc.setTextColor(...PDF_CONFIG.colors.green);
  doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 14, totalY + 15);

  // Total exits
  doc.setTextColor(...PDF_CONFIG.colors.yellow);
  doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 14, totalY + 25);

  // Final balance
  const saldoColor = saldoFinal >= 0 ? PDF_CONFIG.colors.green : PDF_CONFIG.colors.red;
  doc.setTextColor(...saldoColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 14, totalY + 35);
};

export const addFooterToPDF = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(PDF_CONFIG.fonts.tiny);
  doc.setTextColor(120, 120, 120);
  doc.text('Finanças JK - Sistema de Controle Financeiro', 105, pageHeight - 15, { align: 'center' });
};
