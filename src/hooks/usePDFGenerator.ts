
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '@/types/financial';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
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
      
      // Carregar e adicionar logo
      const logoUrl = '/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png';
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = logoUrl;
      });

      // Adicionar logo centralizada
      const logoWidth = 40;
      const logoHeight = 40;
      const pageWidth = doc.internal.pageSize.width;
      const logoX = (pageWidth - logoWidth) / 2;
      
      doc.addImage(logoImg, 'PNG', logoX, 15, logoWidth, logoHeight);
      
      // Título principal
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74);
      doc.text('Finanças JK', pageWidth / 2, 70, { align: 'center' });
      
      // Subtítulo
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Resumo financeiro completo', pageWidth / 2, 85, { align: 'center' });
      
      // Data de geração
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 95, { align: 'center' });
      
      // Ordenar transações por data (mais recente primeiro)
      const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Preparar dados da tabela
      const tableData = sortedTransactions.map(transaction => [
        transaction.type === 'entrada' ? 'Entrada' : 'Saída',
        `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`,
        new Date(transaction.date).toLocaleDateString('pt-BR'),
        transaction.description + (transaction.notes ? ` - ${transaction.notes}` : '')
      ]);
      
      // Configurar tabela com autoTable
      doc.autoTable({
        head: [['Tipo', 'Valor', 'Data', 'Observação']],
        body: tableData,
        startY: 110,
        theme: 'grid',
        headStyles: {
          fillColor: [22, 163, 74],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [40, 40, 40]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 25 },
          1: { halign: 'right', cellWidth: 30 },
          2: { halign: 'center', cellWidth: 25 },
          3: { halign: 'left', cellWidth: 'auto' }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        didParseCell: function(data) {
          if (data.column.index === 0 && data.cell.section === 'body') {
            if (data.cell.text[0] === 'Entrada') {
              data.cell.styles.fillColor = [220, 252, 231];
              data.cell.styles.textColor = [22, 163, 74];
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.fillColor = [254, 249, 195];
              data.cell.styles.textColor = [180, 83, 9];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });
      
      // Calcular posição do rodapé
      const finalY = (doc as any).lastAutoTable.finalY || 110;
      let footerY = finalY + 20;
      
      // Verificar se precisa de nova página
      if (footerY > 250) {
        doc.addPage();
        footerY = 30;
      }
      
      // Rodapé com totais
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      
      doc.setTextColor(22, 163, 74);
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, footerY);
      
      doc.setTextColor(232, 192, 6);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, footerY + 15);
      
      doc.setTextColor(saldoFinal >= 0 ? 22 : 220, saldoFinal >= 0 ? 163 : 38, saldoFinal >= 0 ? 74 : 38);
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, footerY + 30);
      
      // Linha decorativa no rodapé
      doc.setDrawColor(232, 192, 6);
      doc.setLineWidth(1);
      doc.line(20, footerY + 40, pageWidth - 20, footerY + 40);
      
      // Salvar PDF
      doc.save(`resumo-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      // Fallback para PDF simples
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(22, 163, 74);
      doc.text('Finanças JK - Resumo Financeiro', 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      let yPosition = 55;
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 10);
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, yPosition + 20);
      
      doc.save('resumo-financeiro.pdf');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateFinancialPDF,
    isGenerating
  };
};
