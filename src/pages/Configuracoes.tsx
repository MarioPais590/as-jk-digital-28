
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserProfileSection } from '@/components/Settings/UserProfileSection';
import { SystemPreferencesSection } from '@/components/Settings/SystemPreferencesSection';
import { DataManagementSection } from '@/components/Settings/DataManagementSection';
import { DangerZoneSection } from '@/components/Settings/DangerZoneSection';
import { AppInfoSection } from '@/components/Settings/AppInfoSection';
import { UserConfig } from '@/types/user';
import { validateUserProfile } from '@/utils/validators';
import { supabase } from '@/integrations/supabase/client';

export const Configuracoes: React.FC = () => {
  const { updateProfile, user } = useAuth();
  const { toast } = useToast();
  
  const [userConfig, setUserConfig] = useState<UserConfig>({
    nome: '',
    email: '',
    moeda: 'BRL',
    notificacoes: true,
    backupAutomatico: true,
  });

  // Load user profile data from Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('nome, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao carregar perfil:', error);
          // Use user data from auth if profile doesn't exist
          setUserConfig(prev => ({
            ...prev,
            nome: user.user_metadata?.nome || user.email?.split('@')[0] || '',
            email: user.email || ''
          }));
        } else if (data) {
          setUserConfig(prev => ({
            ...prev,
            nome: data.nome || '',
            email: data.email || user.email || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        // Fallback to user auth data
        setUserConfig(prev => ({
          ...prev,
          nome: user.user_metadata?.nome || user.email?.split('@')[0] || '',
          email: user.email || ''
        }));
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSaveConfig = async () => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não encontrado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

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

    try {
      // Atualizar perfil do usuário
      const result = await updateProfile(userConfig.nome, userConfig.email);
      
      if (result.success) {
        toast({
          title: "Configurações salvas",
          description: result.message,
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro interno",
        description: "Erro ao salvar configurações. Tente novamente.",
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
