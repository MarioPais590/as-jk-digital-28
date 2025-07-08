
import React from 'react';
import { InstallmentForm } from '@/components/Installments/InstallmentForm';
import { InstallmentList } from '@/components/Installments/InstallmentList';

export const Parcelas: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Controle de Parcelas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie suas compras parceladas no cartão de crédito
        </p>
      </div>

      {/* Add new installment */}
      <InstallmentForm />

      {/* Installments list */}
      <InstallmentList />
    </div>
  );
};
