
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

      // Adicionar logo centralizada (melhorado)
      const logoWidth = 45;
      const logoHeight = 45;
      const pageWidth = doc.internal.pageSize.width;
      const logoX = (pageWidth - logoWidth) / 2;
      
      doc.addImage(logoImg, 'PNG', logoX, 10, logoWidth, logoHeight);
      
      // Título principal - Finanças JK
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74); // Verde #16A34A
      doc.text('Finanças JK', pageWidth / 2, 70, { align: 'center' });
      
      // Subtítulo - Resumo financeiro completo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Resumo financeiro completo', pageWidth / 2, 82, { align: 'center' });
      
      // Data de geração
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      const currentDate = new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Gerado em: ${currentDate}`, pageWidth / 2, 92, { align: 'center' });
      
      // Linha decorativa abaixo do cabeçalho
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.5);
      doc.line(20, 98, pageWidth - 20, 98);
      
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
      
      // Configurar tabela com autoTable (melhorada)
      doc.autoTable({
        head: [['Tipo', 'Valor', 'Data', 'Observação']],
        body: tableData,
        startY: 105,
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
          cellPadding: 4
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 25 },
          1: { halign: 'right', cellWidth: 30 },
          2: { halign: 'center', cellWidth: 25 },
          3: { halign: 'left', cellWidth: 'auto' }
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        margin: { left: 20, right: 20 },
        didParseCell: function(data) {
          if (data.column.index === 0 && data.cell.section === 'body') {
            if (data.cell.text[0] === 'Entrada') {
              data.cell.styles.fillColor = [220, 252, 231]; // Verde claro
              data.cell.styles.textColor = [22, 163, 74]; // Verde escuro
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.fillColor = [254, 249, 195]; // Amarelo claro
              data.cell.styles.textColor = [180, 83, 9]; // Laranja
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });
      
      // Calcular posição do rodapé
      const finalY = (doc as any).lastAutoTable.finalY || 105;
      let footerY = finalY + 25;
      
      // Verificar se precisa de nova página
      if (footerY > 240) {
        doc.addPage();
        footerY = 30;
      }
      
      // Linha decorativa antes dos totais
      doc.setDrawColor(232, 192, 6); // Amarelo #E8C006
      doc.setLineWidth(1);
      doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
      
      // Título da seção de totais
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Resumo Financeiro', 20, footerY + 10);
      
      // Totais com formatação melhorada
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      
      // Total de Entradas - Verde #16A34A
      doc.setTextColor(22, 163, 74);
      doc.text('Total de Entradas:', 20, footerY + 25);
      doc.text(`R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 70, footerY + 25);
      
      // Total de Saídas - Amarelo/Laranja #E8C006
      doc.setTextColor(232, 192, 6);
      doc.text('Total de Saídas:', 20, footerY + 35);
      doc.text(`R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 70, footerY + 35);
      
      // Saldo Final - Verde para positivo, vermelho para negativo
      doc.setTextColor(saldoFinal >= 0 ? 22 : 220, saldoFinal >= 0 ? 163 : 38, saldoFinal >= 0 ? 74 : 38);
      doc.setFontSize(14);
      doc.text('Saldo Final:', 20, footerY + 50);
      doc.text(`R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 70, footerY + 50);
      
      // Rodapé final com informações adicionais
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Finanças JK - Controle Financeiro Inteligente', pageWidth / 2, footerY + 65, { align: 'center' });
      
      // Salvar PDF com nome personalizado
      const fileName = `financas-jk-resumo-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Fallback simplificado em caso de erro
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(22, 163, 74);
      doc.text('Finanças JK - Resumo Financeiro', 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      let yPosition = 55;
      doc.setTextColor(22, 163, 74);
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
      
      doc.setTextColor(232, 192, 6);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 15);
      
      doc.setTextColor(saldoFinal >= 0 ? 22 : 220, saldoFinal >= 0 ? 163 : 38, saldoFinal >= 0 ? 74 : 38);
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
