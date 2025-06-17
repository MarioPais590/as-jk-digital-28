
import React from 'react';
import { Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { storageUtils } from '@/utils/localStorage';

export const DataManagementSection: React.FC = () => {
  const { toast } = useToast();

  const handleExportData = () => {
    const transactions = storageUtils.getTransactions();
    if (transactions.length > 0) {
      const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financas-jk-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dados exportados",
        description: "Seus dados foram exportados com sucesso.",
      });
    } else {
      toast({
        title: "Nenhum dado encontrado",
        description: "Não há transações para exportar.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          const parsedData = JSON.parse(data);
          
          // Validar se é um array de transações
          if (Array.isArray(parsedData)) {
            storageUtils.setTransactions(parsedData);
            toast({
              title: "Dados importados",
              description: "Seus dados foram importados com sucesso. Recarregue a página para ver as mudanças.",
            });
          } else {
            throw new Error('Formato inválido');
          }
        } catch {
          toast({
            title: "Erro na importação",
            description: "O arquivo selecionado não é válido.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Database className="text-purple-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Gerenciamento de Dados
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Exportar Dados</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Baixe um backup de todos os seus dados
          </p>
          <Button onClick={handleExportData} variant="outline" className="w-full">
            Exportar Dados
          </Button>
        </div>
        
        <div>
          <Label>Importar Dados</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Restaure seus dados a partir de um backup
          </p>
          <Input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
