
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserConfig {
  nome: string;
  email: string;
  moeda: string;
}

interface UserProfileFormProps {
  userConfig: UserConfig;
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userConfig,
  setUserConfig
}) => {
  return (
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
  );
};
