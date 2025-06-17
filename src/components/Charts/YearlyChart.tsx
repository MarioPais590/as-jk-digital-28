
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyBalance } from '@/types/financial';

interface YearlyChartProps {
  data: MonthlyBalance[];
}

export const YearlyChart: React.FC<YearlyChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Comparativo Mensal do Ano
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              tickFormatter={formatCurrency}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'entradas' ? 'Entradas' : name === 'saidas' ? 'Saídas' : 'Saldo'
              ]}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="entradas" fill="#10b981" name="entradas" />
            <Bar dataKey="saidas" fill="#ef4444" name="saidas" />
            <Bar dataKey="saldo" fill="#3b82f6" name="saldo" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
