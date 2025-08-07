
import React from 'react';
import { MonthlyBalance } from '@/types/financial';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface YearlyChartProps {
  data: MonthlyBalance[];
}

const chartConfig = {
  entradas: {
    label: "Entradas",
    color: "hsl(var(--chart-2))",
  },
  saidas: {
    label: "Saídas", 
    color: "hsl(var(--chart-3))",
  },
  saldo: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
};

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
      
      <ChartContainer config={chartConfig} className="h-80">
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
          <ChartTooltip 
            content={<ChartTooltipContent />}
          />
          <Bar dataKey="entradas" fill="var(--color-entradas)" name="entradas" />
          <Bar dataKey="saidas" fill="var(--color-saidas)" name="saidas" />
          <Bar dataKey="saldo" fill="var(--color-saldo)" name="saldo" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
