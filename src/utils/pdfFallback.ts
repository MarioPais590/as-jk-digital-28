
import { jsPDF } from 'jspdf';
import { PDF_CONFIG } from './pdfConfig';

export const generateFallbackPDF = (
  totalEntradas: number,
  totalSaidas: number,
  saldoFinal: number
) => {
  const doc = new jsPDF();
  
  doc.setFontSize(PDF_CONFIG.fonts.title);
  doc.setTextColor(...PDF_CONFIG.colors.green);
  doc.text('Finanças JK - Resumo Financeiro', 105, 20, { align: 'center' });
  
  doc.setFontSize(PDF_CONFIG.fonts.subtitle);
  doc.setTextColor(0, 0, 0);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });
  
  let yPosition = 50;
  
  doc.setFontSize(PDF_CONFIG.fonts.normal);
  doc.setTextColor(...PDF_CONFIG.colors.green);
  doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
  
  doc.setTextColor(...PDF_CONFIG.colors.yellow);
  doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 10);
  
  const saldoColor = saldoFinal >= 0 ? PDF_CONFIG.colors.green : PDF_CONFIG.colors.red;
  doc.setTextColor(...saldoColor);
  doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, yPosition + 20);
  
  doc.save('financas-jk-resumo-fallback.pdf');
};
