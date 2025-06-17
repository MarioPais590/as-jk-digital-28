
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserProfileSection } from '@/components/Settings/UserProfileSection';
import { SystemPreferencesSection } from '@/components/Settings/SystemPreferencesSection';
import { DataManagementSection } from '@/components/Settings/DataManagementSection';
import { DangerZoneSection } from '@/components/Settings/DangerZoneSection';
import { AppInfoSection } from '@/components/Settings/AppInfoSection';
import { UserConfig } from '@/types/user';
import { validateUserProfile } from '@/utils/validators';

export const Configuracoes: React.FC = () => {
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [userConfig, setUserConfig] = useState<UserConfig>({
    nome: '',
    email: '',
    moeda: 'BRL',
    notificacoes: true,
    backupAutomatico: true,
  });

  const handleSaveConfig = () => {
    // Validar dados antes de tentar salvar
    const validation = validateUserProfile(userConfig.nome, userConfig.email);
    
    if (!validation.isValid) {
      toast({
        title: "Campo obrigatório",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    // Atualizar perfil do usuário
    const result = updateProfile(userConfig.nome, userConfig.email);
    
    if (result.success) {
      toast({
        title: "Configurações salvas",
        description: result.message,
      });
      
      // Sincronizar estado local após pequeno delay
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('financas-jk-user') || '{}');
        if (currentUser.id) {
          setUserConfig(prev => ({
            ...prev,
            nome: currentUser.name || '',
            email: currentUser.email || ''
          }));
        }
      }, 100);
    } else {
      toast({
        title: "Erro ao salvar",
        description: result.message,
        variant: "destructive",
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
        <UserProfileSection 
          userConfig={userConfig}
          setUserConfig={setUserConfig}
          onSave={handleSaveConfig}
        />

        {/* Preferências do Sistema */}
        <SystemPreferencesSection 
          userConfig={userConfig}
          setUserConfig={setUserConfig}
        />

        {/* Gerenciamento de Dados */}
        <DataManagementSection />

        {/* Zona de Perigo */}
        <DangerZoneSection />
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSaveConfig} className="px-8">
          Salvar Configurações
        </Button>
      </div>

      {/* Informações do App */}
      <AppInfoSection />
    </div>
  );
};
