
import React from 'react';

export const AppInfoSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sobre o Finanças JK
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">v1.0.0</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Versão</p>
        </div>
        
        <div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2024</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ano de Criação</p>
        </div>
        
        <div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Mário</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Desenvolvedor</p>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Desenvolvido com ❤️ por Mário Augusto</p>
        <p className="mt-1">Aplicativo de gestão financeira pessoal</p>
      </div>
    </div>
  );
};
