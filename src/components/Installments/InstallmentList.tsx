
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useInstallments } from '@/hooks/useInstallments';
import { useSecureCreditCards } from '@/hooks/useSecureCreditCards';
import { Check, Clock, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const InstallmentList: React.FC = () => {
  const { getInstallmentGroups, markInstallmentAsPaid } = useInstallments();
  const { creditCards } = useSecureCreditCards();
  const installmentGroups = getInstallmentGroups();

  const handleMarkAsPaid = async (installmentId: string) => {
    try {
      await markInstallmentAsPaid(installmentId);
      toast.success('Parcela marcada como paga!');
    } catch (error) {
      console.error('Erro ao marcar parcela como paga:', error);
      toast.error('Erro ao marcar parcela como paga');
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
                    <div className="text-left">
                      <CardTitle className="text-lg">{group.descricao}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getCardName(group.parcelas[0]?.cartao_id)} • {formatCurrency(group.valor_total)}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {group.parcelas_pagas}/{group.parcelas_totais} pagas
                    </Badge>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              
              <AccordionContent>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {group.parcelas.map(parcela => (
                      <div
                        key={parcela.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          parcela.status === 'paga'
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-1 rounded-full ${
                            parcela.status === 'paga' ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {parcela.status === 'paga' ? (
                              <Check className="h-4 w-4 text-white" />
                            ) : (
                              <Clock className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              Parcela {parcela.numero_parcela}/{parcela.parcelas_totais}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Vencimento: {format(new Date(parcela.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{formatCurrency(parcela.valor_parcela)}</span>
                          {parcela.status === 'pendente' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsPaid(parcela.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Marcar como Paga
                            </Button>
                          )}
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
