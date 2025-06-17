
import React, { useState, useEffect } from 'react';
import { User, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    localStorage.getItem('financas-jk-user-avatar')
  );

  // Sincronizar dados do usuário com o estado local quando o usuário for carregado
  useEffect(() => {
    if (user) {
      setUserConfig(prev => ({
        ...prev,
        nome: user.name,
        email: user.email
      }));
    }
  }, [user, setUserConfig]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione uma imagem PNG ou JPG.",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem de até 5MB.",
          variant: "destructive",
        });
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

  const handleSaveAvatar = () => {
    if (avatarPreview) {
      localStorage.setItem('financas-jk-user-avatar', avatarPreview);
      toast({
        title: "Avatar salvo",
        description: "Seu avatar foi atualizado com sucesso.",
      });
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    localStorage.removeItem('financas-jk-user-avatar');
    toast({
      title: "Avatar removido",
      description: "Seu avatar foi removido com sucesso.",
    });
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
              {userConfig.nome.charAt(0).toUpperCase()}
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
                <Button onClick={handleSaveAvatar} size="sm" className="flex-1">
                  Salvar Avatar
                </Button>
                <Button onClick={handleRemoveAvatar} variant="outline" size="sm" className="flex-1">
                  Remover
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
