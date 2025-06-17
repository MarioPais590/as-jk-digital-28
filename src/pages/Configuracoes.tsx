
import React, { useState } from 'react';
import { User, Shield, Bell, Database, Trash2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export const Configuracoes: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [userConfig, setUserConfig] = useState({
    nome: 'Usuário',
    email: 'usuario@email.com',
    moeda: 'BRL',
    notificacoes: true,
    backupAutomatico: true,
  });

  const handleSaveConfig = () => {
    // Aqui você salvaria as configurações
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handleExportData = () => {
    const data = localStorage.getItem('financas-jk-data');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
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
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          JSON.parse(data); // Validar se é um JSON válido
          localStorage.setItem('financas-jk-data', data);
          toast({
            title: "Dados importados",
            description: "Seus dados foram importados com sucesso. Recarregue a página para ver as mudanças.",
          });
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Personalize sua experiência no Finanças JK
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil do Usuário */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Perfil do Usuário
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={userConfig.nome}
                onChange={(e) => setUserConfig({...userConfig, nome: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={userConfig.email}
                onChange={(e) => setUserConfig({...userConfig, email: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="moeda">Moeda</Label>
              <Input
                id="moeda"
                value={userConfig.moeda}
                onChange={(e) => setUserConfig({...userConfig, moeda: e.target.value})}
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Atualmente apenas Real Brasileiro (BRL) é suportado
              </p>
            </div>
          </div>
        </div>

        {/* Preferências do Sistema */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferências do Sistema
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo Escuro</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Alternar entre modo claro e escuro
                </p>
              </div>
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber lembretes e alertas
                </p>
              </div>
              <Switch 
                checked={userConfig.notificacoes}
                onCheckedChange={(checked) => setUserConfig({...userConfig, notificacoes: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automático</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Salvar dados automaticamente
                </p>
              </div>
              <Switch 
                checked={userConfig.backupAutomatico}
                onCheckedChange={(checked) => setUserConfig({...userConfig, backupAutomatico: checked})}
              />
            </div>
          </div>
        </div>

        {/* Gerenciamento de Dados */}
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

        {/* Zona de Perigo */}
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
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSaveConfig} className="px-8">
          Salvar Configurações
        </Button>
      </div>

      {/* Informações do App */}
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
    </div>
  );
};
