
import React from 'react';
import { CategoryManager } from '@/components/Categories/CategoryManager';

export const Categorias: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciar Categorias
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Organize suas transações criando e personalizando categorias
        </p>
      </div>

      {/* Category Manager */}
      <CategoryManager />
    </div>
  );
};
