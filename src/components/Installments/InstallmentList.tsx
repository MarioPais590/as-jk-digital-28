import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useInstallments } from '@/hooks/useInstallments';
import { useSecureCreditCards } from '@/hooks/useSecureCreditCards';
import { Check, Clock, CreditCard, Trash2, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { EditInstallmentDialog } from './EditInstallmentDialog';

export const InstallmentList: React.FC = () => {
  const { getInstallmentGroups, markInstallmentAsPaid, markInstallmentAsPending, deleteInstallmentPurchase } = useInstallments();
  const { creditCards } = useSecureCreditCards();
  const installmentGroups = getInstallmentGroups();
  const [loadingActions, setLoadingActions] = React.useState<{ [key: string]: boolean }>({});

  const handleMarkAsPaid = async (installmentId: string) => {
    setLoadingActions(prev => ({ ...prev, [installmentId]: true }));
    try {
      await markInstallmentAsPaid(installmentId);
      toast.success('Parcela marcada como paga!');
    } catch (error) {
      console.error('Erro ao marcar parcela como paga:', error);
      toast.error('Erro ao marcar parcela como paga');
    } finally {
      setLoadingActions(prev => ({ ...prev, [installmentId]: false }));
    }
  };

  const handleMarkAsPending = async (installmentId: string) => {
    setLoadingActions(prev => ({ ...prev, [installmentId]: true }));
    try {
      await markInstallmentAsPending(installmentId);
      toast.success('Parcela desmarcada como paga!');
    } catch (error) {
      console.error('Erro ao desmarcar parcela:', error);
      toast.error('Erro ao desmarcar parcela');
    } finally {
      setLoadingActions(prev => ({ ...prev, [installmentId]: false }));
    }
  };

  const handleDeletePurchase = async (compraId: string) => {
    try {
      await deleteInstallmentPurchase(compraId);
      toast.success('Compra excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir compra:', error);
      toast.error('Erro ao excluir compra');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCardName = (cardId: string) => {
    const card = creditCards.find(c => c.id === cardId);
    return card?.nome || 'Cartão';
  };

  if (installmentGroups.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <CreditCard className="mx-auto h-12 w-12 mb-4" />
            <p>Nenhuma compra parcelada encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="space-y-4">
        {installmentGroups.map(group => (
          <AccordionItem key={group.compra_id} value={group.compra_id} className="border-0">
            <Card>
              <AccordionTrigger className="hover:no-underline p-0">
                <CardHeader className="w-full">
                  <div className="flex justify-between items-start w-full">
                    <div className="text-left flex-1">
                      <CardTitle className="text-lg">{group.descricao}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getCardName(group.parcelas[0]?.cartao_id)} • {formatCurrency(group.valor_total)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant="secondary">
                        {group.parcelas_pagas}/{group.parcelas_totais} pagas
                      </Badge>
                      <div className="flex space-x-1">
                        <EditInstallmentDialog group={group} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.
                                Todas as parcelas serão removidas e as transações pagas serão revertidas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePurchase(group.compra_id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              
              <AccordionContent>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {group.parcelas.map(parcela => (
                      <div
                        key={parcela.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3 ${
                          parcela.status === 'paga'
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`p-1 rounded-full flex-shrink-0 ${
                            parcela.status === 'paga' ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {parcela.status === 'paga' ? (
                              <Check className="h-4 w-4 text-white" />
                            ) : (
                              <Clock className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">
                              Parcela {parcela.numero_parcela}/{parcela.parcelas_totais}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Vencimento: {format(new Date(parcela.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <span className="font-semibold">{formatCurrency(parcela.valor_parcela)}</span>
                          <div className="flex space-x-2 w-full sm:w-auto">
                            {parcela.status === 'pendente' ? (
                              <Button
                                size="sm"
                                onClick={() => handleMarkAsPaid(parcela.id)}
                                disabled={loadingActions[parcela.id]}
                                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial text-xs sm:text-sm"
                              >
                                {loadingActions[parcela.id] ? 'Processando...' : 'Marcar como Paga'}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsPending(parcela.id)}
                                disabled={loadingActions[parcela.id]}
                                className="flex-1 sm:flex-initial text-xs sm:text-sm"
                              >
                                <Undo2 className="h-3 w-3 mr-1" />
                                {loadingActions[parcela.id] ? 'Processando...' : 'Desmarcar'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
