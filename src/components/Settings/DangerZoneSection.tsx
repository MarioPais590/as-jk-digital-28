
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const DangerZoneSection: React.FC = () => {
  const { toast } = useToast();

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('financas-jk-data');
      toast({
        title: "Dados apagados",
        description: "Todos os dados foram removidos. Recarregue a página para ver as mudanças.",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-2 mb-4">
        <Trash2 className="text-red-600" size={20} />
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
          Zona de Perigo
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-red-600 dark:text-red-400">Apagar Todos os Dados</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Esta ação removerá permanentemente todos os seus dados financeiros
          </p>
          <Button 
            onClick={handleClearData} 
            variant="destructive" 
            className="w-full"
          >
            Apagar Todos os Dados
          </Button>
        </div>
      </div>
    </div>
  );
};
