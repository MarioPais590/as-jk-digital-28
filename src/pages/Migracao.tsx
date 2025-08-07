import React from 'react';
import { ProjectMigrationTool } from '@/components/Migration/ProjectMigrationTool';

export const Migracao: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Migração de Projeto
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Exporte e importe todos os dados para um novo projeto
        </p>
      </div>

      {/* Migration Tool */}
      <ProjectMigrationTool />
    </div>
  );
};