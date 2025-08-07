import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { ProjectMigration, ProjectBackupData } from '@/utils/projectMigration';
import { toast } from 'sonner';

export const ProjectMigrationTool: React.FC = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupData, setBackupData] = useState<ProjectBackupData | null>(null);

  const handleExportData = async () => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsExporting(true);
    try {
      const data = await ProjectMigration.exportAllData(user.id);
      setBackupData(data);
      ProjectMigration.downloadBackupFile(data);
      
      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar dados');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsImporting(true);
    try {
      const fileContent = await file.text();
      const importData: ProjectBackupData = JSON.parse(fileContent);
      
      await ProjectMigration.importAllData(importData, user.id);
      
      toast.success('Dados importados com sucesso!');
      // Recarregar a página para atualizar todos os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao importar:', error);
      toast.error('Erro ao importar dados');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Migração de Projeto
          </CardTitle>
          <CardDescription>
            Ferramenta para exportar e importar todos os dados do projeto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Instruções de Migração:</strong>
              <br />
              1. <strong>Exportar dados:</strong> Baixe um backup completo de todos os seus dados
              <br />
              2. <strong>Criar novo projeto:</strong> Crie um novo projeto Lovable limpo
              <br />
              3. <strong>Importar dados:</strong> No novo projeto, importe o arquivo de backup
            </AlertDescription>
          </Alert>

          <Separator />

          {/* Exportação */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Exportar Dados do Projeto Atual</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Baixe um arquivo JSON com todos os seus dados: transações, categorias, cartões, 
                despesas fixas, parcelas e relatórios.
              </p>
              
              <Button 
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exportando...' : 'Exportar Todos os Dados'}
              </Button>
              
              {backupData && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Backup criado com sucesso!</strong>
                    <br />
                    • {backupData.transactions.length} transações
                    <br />
                    • {backupData.categories.length} categorias
                    <br />
                    • {backupData.creditCards.length} cartões de crédito
                    <br />
                    • {backupData.fixedExpenses.length} despesas fixas
                    <br />
                    • {backupData.installments.length} parcelas
                    <br />
                    Data: {new Date(backupData.metadata.exportDate).toLocaleString('pt-BR')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <Separator />

          {/* Importação */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">2. Importar Dados no Novo Projeto</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>ATENÇÃO:</strong> Use esta funcionalidade apenas no novo projeto limpo.
                Todos os dados serão importados e substituirão qualquer dado existente.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="backup-file">Selecionar arquivo de backup (.json)</Label>
                <Input
                  id="backup-file"
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={isImporting}
                />
              </div>
              
              {isImporting && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Importando dados... Não feche esta página.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <Separator />

          {/* Instruções adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">3. Instruções Adicionais</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Para criar um novo projeto:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Vá para <a href="https://lovable.dev" target="_blank" className="text-primary underline">lovable.dev</a></li>
                <li>Clique em "New Project"</li>
                <li>Escolha um template em branco ou similar</li>
                <li>Após criar, copie todo o código-fonte deste projeto corrompido</li>
                <li>Use esta ferramenta para importar os dados</li>
              </ol>
              
              <p className="mt-4">
                <strong>Arquivos importantes para copiar:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Toda a pasta <code>src/</code></li>
                <li>Arquivo <code>tailwind.config.ts</code></li>
                <li>Arquivo <code>index.html</code></li>
                <li>Configurações do Supabase em <code>supabase/</code></li>
                <li>Arquivo <code>package.json</code> (dependências)</li>
              </ul>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};