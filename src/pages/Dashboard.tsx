
import React from 'react';
import { FinancialCard } from '@/components/FinancialCard';
import { MonthlyChart } from '@/components/Charts/MonthlyChart';
import { YearlyChart } from '@/components/Charts/YearlyChart';
import { useFinancialData } from '@/hooks/useFinancialData';
import { CURRENCY_CONFIG, DATE_CONFIG } from '@/constants/app';

export const Dashboard: React.FC = () => {
  const { getMonthlyData, getDailyBalances, getYearlyData } = useFinancialData();
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const monthlyData = getMonthlyData(currentYear, currentMonth);
  const dailyBalances = getDailyBalances(currentYear, currentMonth);
  const yearlyData = getYearlyData(currentYear);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, { 
      style: 'currency', 
      currency: CURRENCY_CONFIG.DEFAULT 
    }).format(value);
  };

  const getCurrentMonthYear = () => {
    return currentDate.toLocaleDateString(DATE_CONFIG.LOCALE, DATE_CONFIG.FORMATS.LONG_MONTH_YEAR);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visão geral das suas finanças em {getCurrentMonthYear()}
        </p>
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
          title="Saldo Atual"
          value={monthlyData.saldoAtual}
          type="saldo"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonthlyChart data={dailyBalances} />
        <YearlyChart data={yearlyData} />
      </div>

      {/* Resumo Estatístico */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Resumo do Mês
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {monthlyData.transacoesCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transações</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(monthlyData.totalEntradas)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Entradas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(monthlyData.totalSaidas)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Saídas</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${monthlyData.saldoAtual >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(monthlyData.saldoAtual)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Saldo</p>
          </div>
        </div>
      </div>
    </div>
  );
};
