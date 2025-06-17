
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

      // Adicionar logo centralizada de forma mais discreta
      const logoWidth = 30;
      const logoHeight = 30;
      const pageWidth = doc.internal.pageSize.width;
      const logoX = (pageWidth - logoWidth) / 2;
      
      doc.addImage(logoImg, 'PNG', logoX, 15, logoWidth, logoHeight);
      
      // Título principal - Finanças JK
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74); // Verde do logotipo
      doc.text('Finanças JK', pageWidth / 2, 55, { align: 'center' });
      
      // Subtítulo - Resumo financeiro completo
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Resumo Financeiro Completo', pageWidth / 2, 65, { align: 'center' });
      
      // Data de geração
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      const currentDate = new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Gerado em: ${currentDate}`, pageWidth / 2, 73, { align: 'center' });
      
      // Linha decorativa sutil
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.3);
      doc.line(30, 78, pageWidth - 30, 78);
      
      // Cards de resumo primeiro (antes da tabela)
      let currentY = 88;
      
      // Título da seção de resumo
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Resumo Geral', 20, currentY);
      currentY += 15;
      
      // Cards em layout horizontal
      const cardWidth = 55;
      const cardHeight = 25;
      const cardSpacing = 10;
      const startX = (pageWidth - (3 * cardWidth + 2 * cardSpacing)) / 2;
      
      // Card Total Entradas
      doc.setFillColor(240, 253, 244); // Verde muito claro
      doc.roundedRect(startX, currentY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.5);
      doc.roundedRect(startX, currentY, cardWidth, cardHeight, 3, 3, 'S');
      
      doc.setFontSize(9);
      doc.setTextColor(22, 163, 74);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL ENTRADAS', startX + cardWidth/2, currentY + 8, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, startX + cardWidth/2, currentY + 17, { align: 'center' });
      
      // Card Total Saídas
      const card2X = startX + cardWidth + cardSpacing;
      doc.setFillColor(255, 251, 235); // Amarelo muito claro
      doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 3, 3, 'S');
      
      doc.setTextColor(245, 158, 11);
      doc.setFontSize(9);
      doc.text('TOTAL SAÍDAS', card2X + cardWidth/2, currentY + 8, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, card2X + cardWidth/2, currentY + 17, { align: 'center' });
      
      // Card Saldo Final
      const card3X = startX + 2 * (cardWidth + cardSpacing);
      const saldoColor = saldoFinal >= 0 ? [22, 163, 74] : [239, 68, 68];
      const saldoBgColor = saldoFinal >= 0 ? [240, 253, 244] : [254, 242, 242];
      
      doc.setFillColor(...saldoBgColor);
      doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(...saldoColor);
      doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 3, 3, 'S');
      
      doc.setTextColor(...saldoColor);
      doc.setFontSize(9);
      doc.text('SALDO FINAL', card3X + cardWidth/2, currentY + 8, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, card3X + cardWidth/2, currentY + 17, { align: 'center' });
      
      currentY += cardHeight + 20;
      
      // Verificar se precisa de nova página antes da tabela
      if (currentY > 200) {
        doc.addPage();
        currentY = 30;
      }
      
      // Título da tabela
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Detalhamento das Transações', 20, currentY);
      currentY += 10;
      
      // Ordenar transações por data (mais recente primeiro)
      const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Preparar dados da tabela com informações mais organizadas
      const tableData = sortedTransactions.map(transaction => [
        new Date(transaction.date).toLocaleDateString('pt-BR'),
        transaction.type === 'entrada' ? 'Entrada' : 'Saída',
        transaction.category,
        transaction.description,
        `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`,
        transaction.notes || '-'
      ]);
      
      // Tabela principal com design melhorado
      doc.autoTable({
        head: [['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Observações']],
        body: tableData,
        startY: currentY,
        theme: 'grid',
        headStyles: {
          fillColor: [22, 163, 74], // Verde do logotipo
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [40, 40, 40],
          cellPadding: 4,
          lineWidth: 0.1,
          lineColor: [200, 200, 200]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 22 }, // Data
          1: { halign: 'center', cellWidth: 20 }, // Tipo
          2: { halign: 'left', cellWidth: 25 },   // Categoria
          3: { halign: 'left', cellWidth: 40 },   // Descrição
          4: { halign: 'right', cellWidth: 25 },  // Valor
          5: { halign: 'left', cellWidth: 'auto' } // Observações
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Cinza muito claro
        },
        margin: { left: 15, right: 15 },
        didParseCell: function(data) {
          // Colorir células de tipo
          if (data.column.index === 1 && data.cell.section === 'body') {
            if (data.cell.text[0] === 'Entrada') {
              data.cell.styles.fillColor = [240, 253, 244]; // Verde muito claro
              data.cell.styles.textColor = [22, 163, 74];
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.fillColor = [255, 251, 235]; // Amarelo muito claro
              data.cell.styles.textColor = [245, 158, 11];
              data.cell.styles.fontStyle = 'bold';
            }
          }
          // Colorir valores
          if (data.column.index === 4 && data.cell.section === 'body') {
            const rowIndex = data.row.index;
            const transactionType = sortedTransactions[rowIndex]?.type;
            if (transactionType === 'entrada') {
              data.cell.styles.textColor = [22, 163, 74];
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.textColor = [245, 158, 11];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });
      
      // Rodapé discreto
      const finalY = (doc as any).lastAutoTable.finalY || currentY;
      
      // Verificar se precisa de nova página para o rodapé
      if (finalY > 250) {
        doc.addPage();
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text('Finanças JK - Sistema de Controle Financeiro', pageWidth / 2, 20, { align: 'center' });
      } else {
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text('Finanças JK - Sistema de Controle Financeiro', pageWidth / 2, finalY + 15, { align: 'center' });
      }
      
      // Salvar PDF com nome personalizado
      const fileName = `financas-jk-resumo-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Fallback simplificado
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setTextColor(22, 163, 74);
      doc.text('Finanças JK - Resumo Financeiro', 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      let yPosition = 55;
      doc.setTextColor(22, 163, 74);
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
      
      doc.setTextColor(245, 158, 11);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 15);
      
      doc.setTextColor(saldoFinal >= 0 ? 22 : 239, saldoFinal >= 0 ? 163 : 68, saldoFinal >= 0 ? 74 : 68);
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, yPosition + 30);
      
      doc.save('financas-jk-resumo-fallback.pdf');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateFinancialPDF,
    isGenerating
  };
};
