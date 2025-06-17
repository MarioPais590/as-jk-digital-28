
import React from 'react';
import { Shield } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UserConfig } from '@/types/user';

interface SystemPreferencesSectionProps {
  userConfig: UserConfig;
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
}

export const SystemPreferencesSection: React.FC<SystemPreferencesSectionProps> = ({
  userConfig,
  setUserConfig
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
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
            onCheckedChange={(checked) => setUserConfig((prev) => ({...prev, notificacoes: checked}))}
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
            onCheckedChange={(checked) => setUserConfig((prev) => ({...prev, backupAutomatico: checked}))}
          />
        </div>
      </div>
    </div>
  );
};
