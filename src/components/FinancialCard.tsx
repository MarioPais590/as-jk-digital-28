
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialCardProps {
  title: string;
  value: number;
  type: 'entrada' | 'saida' | 'saldo';
  className?: string;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({ 
  title, 
  value, 
  type, 
  className 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getIcon = () => {
    switch (type) {
      case 'entrada':
        return <TrendingUp className="text-green-600" size={24} />;
      case 'saida':
        return <TrendingDown className="text-red-600" size={24} />;
      default:
        return <DollarSign className={value >= 0 ? "text-green-600" : "text-red-600"} size={24} />;
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'entrada':
        return 'text-green-600 dark:text-green-400';
      case 'saida':
        return 'text-red-600 dark:text-red-400';
      default:
        return value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className={cn("text-2xl font-bold", getValueColor())}>
            {formatCurrency(value)}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};
