
import React from 'react';
import { Edit, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreditCardUsage } from '@/types/creditCard';
import { 
  formatCardNumber, 
  getCardBrandIcon, 
  getCardBrand, 
  getCardColorByBrand, 
  isBackgroundDark 
} from '@/utils/cardBrandDetector';

interface CreditCardVisualProps {
  usage: CreditCardUsage;
  onEdit: () => void;
  onDelete: () => void;
  onEditColor?: () => void;
  showActions?: boolean;
}

export const CreditCardVisual: React.FC<CreditCardVisualProps> = ({
  usage,
  onEdit,
  onDelete,
  onEditColor,
  showActions = true
}) => {
  const { card, faturaAtual, percentualUsado, limiteDisponivel } = usage;
  
  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value) || value === null || value === undefined) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const brand = card.numero_cartao ? getCardBrand(card.numero_cartao) : 'generico';
  const bgColor = card.custom_color || getCardColorByBrand(brand);
  const textColor = isBackgroundDark(bgColor) ? "text-white" : "text-black";
  const maskedNumber = card.numero_cartao ? formatCardNumber(card.numero_cartao) : '';

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return isBackgroundDark(bgColor) ? 'text-red-300' : 'text-red-600';
    if (percentage >= 70) return isBackgroundDark(bgColor) ? 'text-orange-300' : 'text-orange-600';
    return isBackgroundDark(bgColor) ? 'text-green-300' : 'text-green-600';
  };

  return (
    <div className="relative group">
      {/* Cartão Principal */}
      <div className={`w-[340px] h-[200px] ${bgColor} ${textColor} rounded-xl shadow-md p-6 relative overflow-hidden transition-transform hover:scale-105`}>
        {/* Bandeira do cartão - Canto superior direito */}
        <div className="absolute top-4 right-4">
          {card.numero_cartao && getCardBrandIcon(card.numero_cartao)}
        </div>

        {/* Nome do cartão */}
        <div className="mb-6">
          <h3 className="text-lg font-bold">{card.nome}</h3>
        </div>

        {/* Número mascarado */}
        {maskedNumber && (
          <div className="mb-4">
            <p className="font-mono text-lg tracking-wider">{maskedNumber}</p>
          </div>
        )}

        {/* Informações principais - Layout em grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">Fatura Atual</p>
            <p className={`font-semibold ${getUsageColor(percentualUsado)}`}>
              {formatCurrency(faturaAtual)}
            </p>
          </div>
          
          <div>
            <p className="opacity-80">Uso do Limite</p>
            <p className={`font-semibold ${getUsageColor(percentualUsado)}`}>
              {percentualUsado.toFixed(1)}%
            </p>
          </div>
          
          <div>
            <p className="opacity-80">Limite Total</p>
            <p className="font-medium">{formatCurrency(card.limite)}</p>
          </div>
          
          <div>
            <p className="opacity-80">Disponível</p>
            <p className={`font-medium ${limiteDisponivel >= 0 ? (isBackgroundDark(bgColor) ? 'text-green-300' : 'text-green-600') : (isBackgroundDark(bgColor) ? 'text-red-300' : 'text-red-600')}`}>
              {formatCurrency(limiteDisponivel)}
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="w-full bg-black bg-opacity-20 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-white bg-opacity-80 transition-all duration-300"
              style={{ width: `${Math.min(percentualUsado, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Informações adicionais - Verso do cartão */}
      <div className="w-[340px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          {card.valor_proximas_faturas && card.valor_proximas_faturas > 0 && (
            <div>
              <span className="block font-medium">Próximas Faturas</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(card.valor_proximas_faturas)}
              </span>
            </div>
          )}
          
          <div>
            <span className="block font-medium">Fechamento</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Dia {card.dia_fechamento}
            </span>
          </div>
          
          <div>
            <span className="block font-medium">Vencimento</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Dia {card.dia_vencimento}
            </span>
          </div>
        </div>
      </div>

      {/* Ações - Aparecem ao hover */}
      {showActions && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0 bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            <Edit size={14} />
          </Button>
          {onEditColor && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEditColor}
              className="h-8 w-8 p-0 bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              <Palette size={14} />
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 hover:text-red-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};
