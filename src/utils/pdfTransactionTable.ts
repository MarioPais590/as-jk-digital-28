
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/types/financial';

// Extend jsPDF interface to include autoTable
interface jsPDFWithPlugin extends jsPDF {
  autoTable: typeof autoTable;
  lastAutoTable: {
    finalY: number;
  };
}

export const generateTransactionTable = (
  doc: jsPDFWithPlugin,
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

  return doc.lastAutoTable.finalY;
};
