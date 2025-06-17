
import React from 'react';
import { Download, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const ResumoFinanceiro: React.FC = () => {
  const { transactions } = useFinancialData();

  // Calcular totais
  const totalEntradas = transactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaidas = transactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoFinal = totalEntradas - totalSaidas;

  // Ordenar transações por data (mais recente primeiro)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    try {
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
      doc.setTextColor(22, 163, 74); // Verde #16A34A
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
          fillColor: [22, 163, 74], // Verde #16A34A
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
          // Colorir células de entrada em verde claro e saída em amarelo claro
          if (data.column.index === 0 && data.cell.section === 'body') {
            if (data.cell.text[0] === 'Entrada') {
              data.cell.styles.fillColor = [220, 252, 231]; // Verde claro
              data.cell.styles.textColor = [22, 163, 74]; // Verde escuro
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.fillColor = [254, 249, 195]; // Amarelo claro
              data.cell.styles.textColor = [180, 83, 9]; // Laranja escuro
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
      
      // Total de Entradas
      doc.setTextColor(22, 163, 74); // Verde #16A34A
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, footerY);
      
      // Total de Saídas
      doc.setTextColor(232, 192, 6); // Amarelo #E8C006
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, footerY + 15);
      
      // Saldo Final
      doc.setTextColor(saldoFinal >= 0 ? 22 : 220, saldoFinal >= 0 ? 163 : 38, saldoFinal >= 0 ? 74 : 38);
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, footerY + 30);
      
      // Linha decorativa no rodapé
      doc.setDrawColor(232, 192, 6); // Amarelo #E8C006
      doc.setLineWidth(1);
      doc.line(20, footerY + 40, pageWidth - 20, footerY + 40);
      
      // Salvar PDF
      doc.save(`resumo-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      // Fallback para PDF simples sem logo
      doc.setFontSize(20);
      doc.setTextColor(22, 163, 74);
      doc.text('Finanças JK - Resumo Financeiro', 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      // Adicionar dados básicos
      let yPosition = 55;
      doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}`, 20, yPosition);
      doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}`, 20, yPosition + 10);
      doc.text(`Saldo Final: R$ ${saldoFinal.toFixed(2).replace('.', ',')}`, 20, yPosition + 20);
      
      doc.save('resumo-financeiro.pdf');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resumo Financeiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão completa de todas as suas transações financeiras
          </p>
        </div>
        
        <Button 
          onClick={exportToPDF} 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Download size={20} />
          Baixar PDF
        </Button>
      </div>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEntradas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaidas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoFinal)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma transação encontrada
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.type === 'entrada' ? 'default' : 'destructive'}
                        className={transaction.type === 'entrada' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                      >
                        {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
