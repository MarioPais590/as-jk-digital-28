
import React from 'react';
import { FixedExpenseForm } from '@/components/FixedExpenses/FixedExpenseForm';
import { FixedExpenseList } from '@/components/FixedExpenses/FixedExpenseList';

export const DespesasFixas: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Despesas Fixas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie suas contas fixas mensais
        </p>
      </div>

      {/* Add new fixed expense */}
      <FixedExpenseForm />

      {/* Fixed expenses list */}
      <FixedExpenseList />
    </div>
  );
};
