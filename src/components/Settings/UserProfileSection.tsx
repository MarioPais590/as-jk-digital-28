
import React from 'react';
import { User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AvatarUpload } from './AvatarUpload';
import { UserProfileForm } from './UserProfileForm';

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
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <User className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Perfil do Usuário
        </h3>
      </div>
      
      <div className="space-y-4">
        <AvatarUpload userName={userConfig.nome} />
        <Separator />
        <UserProfileForm 
          userConfig={userConfig}
          setUserConfig={setUserConfig}
        />
      </div>
    </div>
  );
};
