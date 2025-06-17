
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '@/types/financial';

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
      
      // Carregar e adicionar logo
      const logoUrl = '/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png';
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = logoUrl;
      });

      // Inserir o logotipo centralizado no topo (discreto)
      doc.addImage(logoImg, 'PNG', 80, 10, 50, 50);

      // Título principal
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Finanças JK - Resumo Financeiro', 105, 70, { align: 'center' });
      
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
      doc.text(`Gerado em: ${currentDate}`, 105, 78, { align: 'center' });
      
      // Preparar dados para a tabela: Tipo | Valor | Data | Observação
      const linhasTabela = transactions.map(transaction => [
        transaction.type === 'entrada' ? 'Entrada' : 'Saída',
        `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`,
        new Date(transaction.date).toLocaleDateString('pt-BR'),
        `${transaction.category} - ${transaction.description}${transaction.notes ? ` (${transaction.notes})` : ''}`
      ]);

      // Criar tabela com autoTable
      doc.autoTable({
        startY: 90,
        head: [['Tipo', 'Valor', 'Data', 'Observação']],
        body: linhasTabela,
        styles: { 
          fontSize: 10,
          textColor: [40, 40, 40],
          cellPadding: 5
        },
        headStyles: { 
          fillColor: [22, 163, 74], // Verde #16A34A
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 25 }, // Tipo
          1: { halign: 'right', cellWidth: 30 },  // Valor
          2: { halign: 'center', cellWidth: 25 }, // Data
          3: { halign: 'left', cellWidth: 'auto' } // Observação
        },
        alternateRowStyles: { 
          fillColor: [240, 240, 240] // Linhas alternadas sombreadas
        },
        margin: { left: 14, right: 14 },
        didParseCell: function(data) {
          // Colorir células de tipo
          if (data.column.index === 0 && data.cell.section === 'body') {
            if (data.cell.text[0] === 'Entrada') {
              data.cell.styles.textColor = [22, 163, 74]; // Verde
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.textColor = [232, 192, 6]; // Amarelo
              data.cell.styles.fontStyle = 'bold';
            }
          }
          // Colorir valores
          if (data.column.index === 1 && data.cell.section === 'body') {
            const rowIndex = data.row.index;
            const transactionType = transactions[rowIndex]?.type;
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

      // Posição para os totais após a tabela
      const totalY = doc.lastAutoTable.finalY + 20;

      // Seção de totais
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Resumo dos Totais', 14, totalY);

      // Total de Entradas - Verde #16A34A
      doc.setFontSize(12);
      doc.setTextColor(22, 163, 74);
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 14, totalY + 15);

      // Total de Saídas - Amarelo #E8C006
      doc.setTextColor(232, 192, 6);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 14, totalY + 25);

      // Saldo Final - Verde se positivo, vermelho se negativo
      const saldoColor: [number, number, number] = saldoFinal >= 0 ? [22, 163, 74] : [220, 38, 38];
      doc.setTextColor(saldoColor[0], saldoColor[1], saldoColor[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 14, totalY + 35);

      // Rodapé discreto
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Finanças JK - Sistema de Controle Financeiro', 105, pageHeight - 15, { align: 'center' });

      // Salvar PDF com nome personalizado
      const fileName = `financas-jk-resumo-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Fallback simples em caso de erro
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.setTextColor(22, 163, 74);
      doc.text('Finanças JK - Resumo Financeiro', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });
      
      let yPosition = 50;
      
      // Totais de fallback
      doc.setFontSize(12);
      doc.setTextColor(22, 163, 74);
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
      
      doc.setTextColor(232, 192, 6);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 10);
      
      const saldoColor: [number, number, number] = saldoFinal >= 0 ? [22, 163, 74] : [220, 38, 38];
      doc.setTextColor(saldoColor[0], saldoColor[1], saldoColor[2]);
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, yPosition + 20);
      
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
