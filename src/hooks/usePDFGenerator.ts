
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

      // Adicionar logo centralizada de forma discreta
      const logoWidth = 25;
      const logoHeight = 25;
      const pageWidth = doc.internal.pageSize.width;
      const logoX = (pageWidth - logoWidth) / 2;
      
      doc.addImage(logoImg, 'PNG', logoX, 15, logoWidth, logoHeight);
      
      // Título principal - Finanças JK
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74); // Verde #16A34A
      doc.text('Finanças JK - Resumo Financeiro', pageWidth / 2, 50, { align: 'center' });
      
      // Subtítulo com data de geração
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const currentDate = new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Gerado em: ${currentDate}`, pageWidth / 2, 60, { align: 'center' });
      
      // Ordenar transações por data (mais recente primeiro)
      const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Preparar dados da tabela conforme especificado: Tipo | Valor | Data | Observação
      const tableData = sortedTransactions.map(transaction => [
        transaction.type === 'entrada' ? 'Entrada' : 'Saída',
        `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`,
        new Date(transaction.date).toLocaleDateString('pt-BR'),
        `${transaction.category} - ${transaction.description}${transaction.notes ? ` (${transaction.notes})` : ''}`
      ]);
      
      let currentY = 75;
      
      // Verificar se há transações para mostrar
      if (sortedTransactions.length > 0) {
        // Tabela principal com design conforme especificado
        doc.autoTable({
          head: [['Tipo', 'Valor', 'Data', 'Observação']],
          body: tableData,
          startY: currentY,
          theme: 'grid',
          headStyles: {
            fillColor: [22, 163, 74], // Verde #16A34A
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: 6
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [40, 40, 40],
            cellPadding: 5,
            lineWidth: 0.1,
            lineColor: [200, 200, 200]
          },
          columnStyles: {
            0: { halign: 'center', cellWidth: 25 }, // Tipo
            1: { halign: 'right', cellWidth: 30 },  // Valor
            2: { halign: 'center', cellWidth: 25 }, // Data
            3: { halign: 'left', cellWidth: 'auto' } // Observação
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251] // Linhas alternadas levemente sombreadas
          },
          margin: { left: 15, right: 15 },
          didParseCell: function(data) {
            // Colorir células de tipo
            if (data.column.index === 0 && data.cell.section === 'body') {
              if (data.cell.text[0] === 'Entrada') {
                data.cell.styles.fillColor = [240, 253, 244]; // Verde muito claro
                data.cell.styles.textColor = [22, 163, 74]; // Verde #16A34A
                data.cell.styles.fontStyle = 'bold';
              } else {
                data.cell.styles.fillColor = [255, 251, 235]; // Amarelo muito claro
                data.cell.styles.textColor = [232, 192, 6]; // Amarelo #E8C006
                data.cell.styles.fontStyle = 'bold';
              }
            }
            // Colorir valores
            if (data.column.index === 1 && data.cell.section === 'body') {
              const rowIndex = data.row.index;
              const transactionType = sortedTransactions[rowIndex]?.type;
              if (transactionType === 'entrada') {
                data.cell.styles.textColor = [22, 163, 74]; // Verde para entradas
                data.cell.styles.fontStyle = 'bold';
              } else {
                data.cell.styles.textColor = [232, 192, 6]; // Amarelo para saídas
                data.cell.styles.fontStyle = 'bold';
              }
            }
          }
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 20;
      } else {
        // Mensagem quando não há transações
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Nenhuma transação encontrada', pageWidth / 2, currentY + 30, { align: 'center' });
        currentY += 60;
      }
      
      // Verificar se precisa de nova página para os totais
      if (currentY > 220) {
        doc.addPage();
        currentY = 30;
      }
      
      // Seção de totais e saldo final em destaque
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Resumo dos Totais', 20, currentY);
      currentY += 15;
      
      // Total de Entradas - Verde #16A34A
      doc.setFontSize(12);
      doc.setTextColor(22, 163, 74);
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, currentY);
      currentY += 10;
      
      // Total de Saídas - Amarelo #E8C006
      doc.setTextColor(232, 192, 6);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, currentY);
      currentY += 10;
      
      // Saldo Final - Verde se positivo, vermelho se negativo
      const saldoColor = saldoFinal >= 0 ? [22, 163, 74] : [239, 68, 68];
      doc.setTextColor(saldoColor[0], saldoColor[1], saldoColor[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, currentY);
      
      // Rodapé discreto
      const finalY = Math.max(currentY + 20, 260);
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Finanças JK - Sistema de Controle Financeiro', pageWidth / 2, finalY, { align: 'center' });
      
      // Salvar PDF com nome personalizado
      const fileName = `financas-jk-resumo-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Fallback manual sem autoTable
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Título de fallback
      doc.setFontSize(18);
      doc.setTextColor(22, 163, 74);
      doc.text('Finanças JK - Resumo Financeiro', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 30, { align: 'center' });
      
      let yPosition = 50;
      
      // Totais de fallback
      doc.setFontSize(12);
      doc.setTextColor(22, 163, 74);
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
      
      doc.setTextColor(232, 192, 6);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 15);
      
      doc.setTextColor(saldoFinal >= 0 ? 22 : 239, saldoFinal >= 0 ? 163 : 68, saldoFinal >= 0 ? 74 : 68);
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, yPosition + 30);
      
      // Lista simples de transações em fallback
      yPosition += 50;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Transações:', 20, yPosition);
      yPosition += 10;
      
      transactions.slice(0, 20).forEach((transaction, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        const color = transaction.type === 'entrada' ? [22, 163, 74] : [232, 192, 6];
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(
          `${transaction.type === 'entrada' ? 'Entrada' : 'Saída'}: R$ ${transaction.amount.toFixed(2).replace('.', ',')} - ${transaction.description}`,
          20,
          yPosition
        );
        yPosition += 8;
      });
      
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
