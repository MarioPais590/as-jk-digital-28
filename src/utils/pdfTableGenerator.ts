
import { jsPDF } from 'jspdf';
import { Transaction } from '@/types/financial';
import { PDF_CONFIG } from './pdfConfig';

export const generateTransactionTable = (
  doc: jsPDF,
  transactions: Transaction[],
  startY: number
) => {
  const tableData = transactions.map(transaction => [
    transaction.type === 'entrada' ? 'Entrada' : 'Saída',
    `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`,
    new Date(transaction.date).toLocaleDateString('pt-BR'),
    `${transaction.category} - ${transaction.description}${transaction.notes ? ` (${transaction.notes})` : ''}`
  ]);

  doc.autoTable({
    startY,
    head: [['Tipo', 'Valor', 'Data', 'Observação']],
    body: tableData,
    styles: { 
      fontSize: PDF_CONFIG.fonts.small,
      textColor: PDF_CONFIG.colors.darkGray,
      cellPadding: 5
    },
    headStyles: { 
      fillColor: PDF_CONFIG.colors.green,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 25 },
      1: { halign: 'right', cellWidth: 30 },
      2: { halign: 'center', cellWidth: 25 },
      3: { halign: 'left', cellWidth: 'auto' }
    },
    alternateRowStyles: { 
      fillColor: PDF_CONFIG.colors.lightGray
    },
    margin: PDF_CONFIG.layout.margins,
    didParseCell: function(data) {
      if (data.column.index === 0 && data.cell.section === 'body') {
        if (data.cell.text[0] === 'Entrada') {
          data.cell.styles.textColor = PDF_CONFIG.colors.green;
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = PDF_CONFIG.colors.yellow;
          data.cell.styles.fontStyle = 'bold';
        }
      }
      if (data.column.index === 1 && data.cell.section === 'body') {
        const rowIndex = data.row.index;
        const transactionType = transactions[rowIndex]?.type;
        if (transactionType === 'entrada') {
          data.cell.styles.textColor = PDF_CONFIG.colors.green;
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = PDF_CONFIG.colors.yellow;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  return doc.lastAutoTable.finalY;
};
