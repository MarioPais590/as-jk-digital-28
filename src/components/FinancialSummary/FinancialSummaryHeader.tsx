
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinancialSummaryHeaderProps {
  onExportPDF: () => void;
  isGenerating?: boolean;
}

export const FinancialSummaryHeader: React.FC<FinancialSummaryHeaderProps> = ({
  onExportPDF,
  isGenerating = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resumo Financeiro
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visão completa de todas as suas transações financeiras
        </p>
      </div>
      
      <Button 
        onClick={onExportPDF} 
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        disabled={isGenerating}
      >
        <Download size={20} />
        {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
      </Button>
    </div>
  );
};
