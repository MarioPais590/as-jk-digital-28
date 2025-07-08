
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFixedExpenses } from '@/hooks/useFixedExpenses';
import { Check, Clock, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const FixedExpenseList: React.FC = () => {
  const { fixedExpenses, markExpenseAsPaid, deleteFixedExpense } = useFixedExpenses();

  const handleMarkAsPaid = async (expenseId: string) => {
    try {
      await markExpenseAsPaid(expenseId);
      toast.success('Despesa marcada como paga!');
    } catch (error) {
      console.error('Erro ao marcar despesa como paga:', error);
      toast.error('Erro ao marcar despesa como paga');
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa fixa?')) {
      try {
        await deleteFixedExpense(expenseId);
        toast.success('Despesa excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir despesa:', error);
        toast.error('Erro ao excluir despesa');
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paga': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'atrasada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paga': return <Check className="h-4 w-4" />;
      case 'atrasada': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const sortedExpenses = [...fixedExpenses].sort((a, b) => {
    // Ordenar por status (atrasada primeiro, depois pendente, depois paga)
    const statusOrder = { 'atrasada': 0, 'pendente': 1, 'paga': 2 };
    const statusComparison = statusOrder[a.status] - statusOrder[b.status];
    
    if (statusComparison !== 0) return statusComparison;
    
    // Depois por data de vencimento
    return new Date(a.proximo_vencimento).getTime() - new Date(b.proximo_vencimento).getTime();
  });

  if (fixedExpenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Clock className="mx-auto h-12 w-12 mb-4" />
            <p>Nenhuma despesa fixa encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedExpenses.map(expense => (
        <Card key={expense.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(expense.status)}`}>
                  {getStatusIcon(expense.status)}
                </div>
                <div>
                  <h3 className="font-semibold">{expense.nome}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {expense.categoria} • Vencimento: {format(new Date(expense.proximo_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(expense.valor)}</p>
                  <Badge className={getStatusColor(expense.status)}>
                    {expense.status}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  {expense.status === 'pendente' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsPaid(expense.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Pagar
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {/* TODO: Implementar edição */}}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
