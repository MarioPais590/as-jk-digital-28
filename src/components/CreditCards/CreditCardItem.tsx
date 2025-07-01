
import React from 'react';
import { Edit, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardUsage } from '@/types/creditCard';
import { formatCardNumber, getCardBrandImage } from '@/utils/cardBrandDetector';

interface CreditCardItemProps {
  usage: CreditCardUsage;
  onEdit: () => void;
  onDelete: () => void;
}

export const CreditCardItem: React.FC<CreditCardItemProps> = ({
  usage,
  onEdit,
  onDelete
}) => {
  const { card, faturaAtual, percentualUsado, limiteDisponivel } = usage;
  
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

  const cardBrandImage = card.numero_cartao ? getCardBrandImage(card.numero_cartao) : '';
  const maskedNumber = card.numero_cartao ? formatCardNumber(card.numero_cartao) : '';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {cardBrandImage ? (
            <img 
              src={cardBrandImage} 
              alt="Bandeira do cartão" 
              className="h-6 w-auto"
              onError={(e) => {
                e.currentTarget.src = '/bandeiras/generico.png';
              }}
            />
          ) : (
            <CreditCard size={20} />
          )}
          {card.nome}
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {maskedNumber && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="block">Número</span>
            <span className="font-mono">{maskedNumber}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Fatura Atual</span>
            <span className={`font-semibold ${getUsageColor(percentualUsado)}`}>
              {formatCurrency(faturaAtual)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Uso do Limite</span>
            <span className={`font-semibold ${getUsageColor(percentualUsado)}`}>
              {percentualUsado.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Limite Total</span>
            <span className="font-medium">{formatCurrency(card.limite)}</span>
          </div>

          {card.valor_proximas_faturas && card.valor_proximas_faturas > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Próximas Faturas</span>
              <span className="font-medium">{formatCurrency(card.valor_proximas_faturas)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Limite Disponível</span>
            <span className={`font-medium ${limiteDisponivel >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(limiteDisponivel)}
            </span>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="space-y-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(percentualUsado)} transition-all duration-300`}
              style={{ width: `${Math.min(percentualUsado, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <span className="block">Fechamento</span>
            <span className="font-medium">Dia {card.dia_fechamento}</span>
          </div>
          <div>
            <span className="block">Vencimento</span>
            <span className="font-medium">Dia {card.dia_vencimento}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
