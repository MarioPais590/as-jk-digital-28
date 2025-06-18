
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
  
  const [userConfig, setUserConfig] = useState<UserConfig>({
    nome: '',
    email: '',
    moeda: 'BRL',
    notificacoes: true,
    backupAutomatico: true,
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load user profile data from Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        console.log('Loading profile for user:', user.id);
        
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
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSaveConfig = async () => {
    if (!user) {
      toast.error('Usuário não encontrado. Faça login novamente.');
      return;
    }

    // Validar dados antes de tentar salvar
    const validation = validateUserProfile(userConfig.nome, userConfig.email);
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setIsSaving(true);

    try {
      // Atualizar perfil do usuário no Supabase
      const result = await updateProfile(userConfig.nome, userConfig.email);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro interno. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando configurações...</p>
        </div>
      </div>
    );
  }

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
        <Button 
          onClick={handleSaveConfig} 
          className="px-8"
          disabled={isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

      {/* Informações do App */}
      <AppInfoSection />
    </div>
  );
};
