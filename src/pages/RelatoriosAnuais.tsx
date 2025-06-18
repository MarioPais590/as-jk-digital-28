import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useSupabaseFinancialData } from '@/hooks/useSupabaseFinancialData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinancialCard } from '@/components/FinancialCard';
import { YearlyChart } from '@/components/Charts/YearlyChart';

export const RelatoriosAnuais: React.FC = () => {
  const { getYearlyData, transactions, loading } = useSupabaseFinancialData();
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const yearlyData = getYearlyData(parseInt(selectedYear));
  
  const yearTransactions = transactions.filter(t => 
    new Date(t.date).getFullYear() === parseInt(selectedYear)
  );

  const totalEntradas = yearlyData.reduce((sum, month) => sum + month.entradas, 0);
  const totalSaidas = yearlyData.reduce((sum, month) => sum + month.saidas, 0);
  const saldoAnual = totalEntradas - totalSaidas;

  const availableYears = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear())))
    .sort((a, b) => b - a);

  const categoriesData = yearTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = { entradas: 0, saidas: 0, total: 0 };
    }
    if (transaction.type === 'entrada') {
      acc[transaction.category].entradas += transaction.amount;
    } else {
      acc[transaction.category].saidas += transaction.amount;
    }
    acc[transaction.category].total = acc[transaction.category].entradas - acc[transaction.category].saidas;
    return acc;
  }, {} as Record<string, { entradas: number; saidas: number; total: number }>);

  const bestMonth = yearlyData.reduce((best, current) => 
    current.saldo > best.saldo ? current : best
  );
  
  const worstMonth = yearlyData.reduce((worst, current) => 
    current.saldo < worst.saldo ? current : worst
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Relatórios Anuais
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análise completa das finanças por ano
          </p>
        </div>
        
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Resumo Anual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinancialCard
          title="Total de Entradas"
          value={totalEntradas}
          type="entrada"
        />
        <FinancialCard
          title="Total de Saídas"
          value={totalSaidas}
          type="saida"
        />
        <FinancialCard
          title="Saldo Anual"
          value={saldoAnual}
          type="saldo"
        />
      </div>

      {/* Gráfico Comparativo Mensal */}
      <YearlyChart data={yearlyData} />

      {/* Melhores e Piores Meses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Melhor Mês
            </h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {bestMonth.month}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bestMonth.saldo)}
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Entradas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bestMonth.entradas)}</p>
              <p>Saídas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bestMonth.saidas)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-red-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pior Mês
            </h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {worstMonth.month}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(worstMonth.saldo)}
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Entradas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(worstMonth.entradas)}</p>
              <p>Saídas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(worstMonth.saidas)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Análise por Categorias Anual */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance por Categoria no Ano
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Entradas
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Saídas
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(categoriesData)
                .sort(([_, a], [__, b]) => b.total - a.total)
                .map(([category, data]) => (
                  <tr key={category} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {category}
                    </td>
                    <td className="px-4 py-2 text-sm text-green-600 dark:text-green-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.entradas)}
                    </td>
                    <td className="px-4 py-2 text-sm text-red-600 dark:text-red-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.saidas)}
                    </td>
                    <td className={`px-4 py-2 text-sm font-semibold ${data.total >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estatísticas Detalhadas de {selectedYear}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {yearTransactions.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Transações</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {yearTransactions.filter(t => t.type === 'entrada').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Entradas</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {yearTransactions.filter(t => t.type === 'saida').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Saídas</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.keys(categoriesData).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Categorias Ativas</p>
          </div>
        </div>
      </div>
    </div>
  );
};
