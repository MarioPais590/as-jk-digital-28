
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AvatarUploadProps {
  userName: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ userName }) => {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    localStorage.getItem('financas-jk-user-avatar')
  );
  const [isUploading, setIsUploading] = useState(false);

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
      if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
        toast.error('Por favor, selecione uma imagem PNG ou JPG.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Por favor, selecione uma imagem de até 5MB.');
        return;
      }

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

    setIsUploading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarPreview })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao salvar avatar no Supabase:', error);
        toast.error('Erro ao salvar avatar. Tente novamente.');
        return;
      }

      localStorage.setItem('financas-jk-user-avatar', avatarPreview);
      window.dispatchEvent(new Event('storage'));
      
      toast.success('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
      toast.error('Erro ao salvar avatar. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) {
      toast.error('Usuário não encontrado.');
      return;
    }

    setIsUploading(true);

    try {
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
      window.dispatchEvent(new Event('storage'));
      
      toast.success('Avatar removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      toast.error('Erro ao remover avatar. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        {avatarPreview && (
          <AvatarImage src={avatarPreview} alt="Preview do avatar" />
        )}
        <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
          {userName.charAt(0).toUpperCase() || 'U'}
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
              disabled={isUploading}
            >
              {isUploading ? 'Salvando...' : 'Salvar Avatar'}
            </Button>
            <Button 
              onClick={handleRemoveAvatar} 
              variant="outline" 
              size="sm" 
              className="flex-1"
              disabled={isUploading}
            >
              {isUploading ? 'Removendo...' : 'Remover'}
            </Button>
          </>
        )}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Formatos aceitos: PNG, JPG. Tamanho recomendado: 512x512px (máx. 5MB)
      </p>
    </div>
  );
};
