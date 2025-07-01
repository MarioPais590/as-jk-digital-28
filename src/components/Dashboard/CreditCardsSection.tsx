
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardUsage } from '@/types/creditCard';
import { formatCardNumber, getCardBrandImage } from '@/utils/cardBrandDetector';

interface CreditCardsSectionProps {
  creditCardUsages: CreditCardUsage[];
}

export const CreditCardsSection: React.FC<CreditCardsSectionProps> = ({
  creditCardUsages
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (creditCardUsages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} />
          Cartões de Crédito
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creditCardUsages.map(usage => {
            const cardBrandImage = usage.card.numero_cartao ? getCardBrandImage(usage.card.numero_cartao) : '';
            const maskedNumber = usage.card.numero_cartao ? formatCardNumber(usage.card.numero_cartao) : '';
            
            return (
              <div key={usage.card.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {cardBrandImage ? (
                      <img 
                        src={cardBrandImage} 
                        alt="Bandeira do cartão" 
                        className="h-4 w-auto"
                        onError={(e) => {
                          e.currentTarget.src = '/bandeiras/generico.png';
                        }}
                      />
                    ) : null}
                    <h4 className="font-medium text-sm">{usage.card.nome}</h4>
                  </div>
                  <span className={`text-xs font-semibold ${getUsageColor(usage.percentualUsado)}`}>
                    {usage.percentualUsado.toFixed(1)}%
                  </span>
                </div>

                {maskedNumber && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {maskedNumber}
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Fatura</span>
                    <span className={`font-semibold ${getUsageColor(usage.percentualUsado)}`}>
                      {formatCurrency(usage.faturaAtual)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Limite</span>
                    <span>{formatCurrency(usage.card.limite)}</span>
                  </div>
                  {usage.card.valor_proximas_faturas && usage.card.valor_proximas_faturas > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Próximas</span>
                      <span>{formatCurrency(usage.card.valor_proximas_faturas)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Disponível</span>
                    <span className={usage.limiteDisponivel >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(usage.limiteDisponivel)}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getProgressColor(usage.percentualUsado)} transition-all duration-300`}
                    style={{ width: `${Math.min(usage.percentualUsado, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
