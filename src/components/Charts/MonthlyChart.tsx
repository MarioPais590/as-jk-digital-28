
import React from 'react';
import { DailyBalance } from '@/types/financial';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface MonthlyChartProps {
  data: DailyBalance[];
}

const chartConfig = {
  balance: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
};

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate().toString();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Evolução Diária do Saldo
      </h3>
      
      <ChartContainer config={chartConfig} className="h-80">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            className="text-gray-600 dark:text-gray-400"
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="var(--color-balance)" 
            strokeWidth={2}
            dot={{ fill: "var(--color-balance)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "var(--color-balance)" }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
