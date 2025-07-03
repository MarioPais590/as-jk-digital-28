
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useSupabaseFinancialData } from '@/hooks/useSupabaseFinancialData';
import { useFinancialReports } from '@/hooks/useFinancialReports';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinancialCard } from '@/components/FinancialCard';
import { MonthlyChart } from '@/components/Charts/MonthlyChart';

export const RelatoriosMensais: React.FC = () => {
  const { transactions, loading } = useSupabaseFinancialData();
  const { getMonthlyData, getDailyBalances } = useFinancialReports(transactions);
  
  const currentDate = new Date();
  
  // Garantir que temos anos disponíveis das transações, senão usar o ano atual
  const availableYears = transactions.length > 0 
    ? Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))).sort((a, b) => b - a)
    : [currentDate.getFullYear()];
  
  // Inicializar com o primeiro ano disponível e o mês atual
  const [selectedYear, setSelectedYear] = useState(() => {
    return availableYears.length > 0 ? availableYears[0].toString() : currentDate.getFullYear().toString();
  });
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth().toString());

  // Atualizar selectedYear quando as transações carregarem
  useEffect(() => {
    if (transactions.length > 0 && availableYears.length > 0) {
      const currentSelectedYear = parseInt(selectedYear);
      // Se o ano selecionado não está nas opções disponíveis, selecionar o primeiro disponível
      if (!availableYears.includes(currentSelectedYear)) {
        setSelectedYear(availableYears[0].toString());
      }
    }
  }, [transactions.length, availableYears]);

  const monthlyData = getMonthlyData(parseInt(selectedYear), parseInt(selectedMonth));
  const dailyBalances = getDailyBalances(parseInt(selectedYear), parseInt(selectedMonth));

  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === parseInt(selectedYear) && date.getMonth() === parseInt(selectedMonth);
  });

  const categoriesData = monthTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = { entradas: 0, saidas: 0 };
    }
    if (transaction.type === 'entrada') {
      acc[transaction.category].entradas += transaction.amount;
    } else {
      acc[transaction.category].saidas += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { entradas: number; saidas: number }>);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

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
            Relatórios Mensais
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análise detalhada das finanças por mês
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinancialCard
          title="Total de Entradas"
          value={monthlyData.totalEntradas}
          type="entrada"
        />
        <FinancialCard
          title="Total de Saídas"
          value={monthlyData.totalSaidas}
          type="saida"
        />
        <FinancialCard
          title="Saldo do Mês"
          value={monthlyData.saldoAtual}
          type="saldo"
        />
      </div>

      {/* Gráfico de Evolução Diária */}
      <MonthlyChart data={dailyBalances} />

      {/* Análise por Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas por Categoria */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Entradas por Categoria
            </h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(categoriesData)
              .filter(([_, data]) => data.entradas > 0)
              .sort(([_, a], [__, b]) => b.entradas - a.entradas)
              .map(([category, data]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.entradas)}
                  </span>
                </div>
              ))}
            {Object.keys(categoriesData).filter(cat => categoriesData[cat].entradas > 0).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma entrada registrada neste período
              </p>
            )}
          </div>
        </div>

        {/* Saídas por Categoria */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-red-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Saídas por Categoria
            </h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(categoriesData)
              .filter(([_, data]) => data.saidas > 0)
              .sort(([_, a], [__, b]) => b.saidas - a.saidas)
              .map(([category, data]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.saidas)}
                  </span>
                </div>
              ))}
            {Object.keys(categoriesData).filter(cat => categoriesData[cat].saidas > 0).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma saída registrada neste período
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas Adicionais */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Estatísticas do Período
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {monthTransactions.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transações</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {monthTransactions.filter(t => t.type === 'entrada').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Entradas</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {monthTransactions.filter(t => t.type === 'saida').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Saídas</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.keys(categoriesData).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Categorias</p>
          </div>
        </div>
      </div>
    </div>
  );
};
