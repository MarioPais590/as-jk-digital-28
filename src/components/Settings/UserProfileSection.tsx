
import React, { useState, useEffect } from 'react';
import { User, Upload } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserConfig {
  nome: string;
  email: string;
  moeda: string;
}

interface UserProfileSectionProps {
  userConfig: UserConfig;
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
  onSave: () => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userConfig,
  setUserConfig,
  onSave
}) => {
  const { user } = useAuth();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    localStorage.getItem('financas-jk-user-avatar')
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Load avatar from Supabase profile
  useEffect(() => {
    const loadAvatarFromSupabase = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao carregar avatar do Supabase:', error);
          return;
        }

        if (data?.avatar_url) {
          setAvatarPreview(data.avatar_url);
          localStorage.setItem('financas-jk-user-avatar', data.avatar_url);
        }
      } catch (error) {
        console.error('Erro ao carregar avatar:', error);
      }
    };

    loadAvatarFromSupabase();
  }, [user]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
        toast.error('Por favor, selecione uma imagem PNG ou JPG.');
        return;
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Por favor, selecione uma imagem de até 5MB.');
        return;
      }

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarPreview || !user) {
      toast.error('Nenhuma imagem selecionada ou usuário não encontrado.');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Update avatar_url in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarPreview })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao salvar avatar no Supabase:', error);
        toast.error('Erro ao salvar avatar. Tente novamente.');
        return;
      }

      // Update localStorage
      localStorage.setItem('financas-jk-user-avatar', avatarPreview);
      
      // Dispatch storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      toast.success('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
      toast.error('Erro ao salvar avatar. Tente novamente.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) {
      toast.error('Usuário não encontrado.');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Remove avatar_url from profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao remover avatar do Supabase:', error);
        toast.error('Erro ao remover avatar. Tente novamente.');
        return;
      }

      setAvatarPreview(null);
      localStorage.removeItem('financas-jk-user-avatar');
      
      // Dispatch storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      toast.success('Avatar removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      toast.error('Erro ao remover avatar. Tente novamente.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <User className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Perfil do Usuário
        </h3>
      </div>
      
      <div className="space-y-4">
        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            {avatarPreview && (
              <AvatarImage src={avatarPreview} alt="Preview do avatar" />
            )}
            <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              {userConfig.nome.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Label htmlFor="avatar-upload" className="cursor-pointer flex-1">
              <div className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Upload size={16} />
                <span className="text-sm">Selecionar Imagem</span>
              </div>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            {avatarPreview && (
              <>
                <Button 
                  onClick={handleSaveAvatar} 
                  size="sm" 
                  className="flex-1"
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? 'Salvando...' : 'Salvar Avatar'}
                </Button>
                <Button 
                  onClick={handleRemoveAvatar} 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? 'Removendo...' : 'Remover'}
                </Button>
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Formatos aceitos: PNG, JPG. Tamanho recomendado: 512x512px (máx. 5MB)
          </p>
        </div>

        <Separator />
        
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
  );
};
