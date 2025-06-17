
import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { storageUtils } from '@/utils/localStorage';
import { USER_EVENTS } from '@/utils/events';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // Atualizar nome do usuário quando o contexto de autenticação mudar
  useEffect(() => {
    if (user?.name) {
      setCurrentUserName(user.name);
    }
  }, [user]);

  // Recuperar avatar do localStorage e escutar mudanças
  useEffect(() => {
    const updateUserData = () => {
      // Atualizar avatar
      setSavedAvatar(storageUtils.getUserAvatar());
      
      // Atualizar nome do usuário
      const savedUser = storageUtils.getUser();
      if (savedUser?.name) {
        setCurrentUserName(savedUser.name);
      }
    };

    // Carregar dados iniciais
    updateUserData();

    // Escutar eventos de atualização de perfil
    const handleProfileUpdate = (event: any) => {
      console.log('Profile updated event received:', event.detail);
      updateUserData();
    };

    window.addEventListener(USER_EVENTS.PROFILE_UPDATED, handleProfileUpdate);
    window.addEventListener('storage', updateUserData);
    
    return () => {
      window.removeEventListener(USER_EVENTS.PROFILE_UPDATED, handleProfileUpdate);
      window.removeEventListener('storage', updateUserData);
    };
  }, []);

  // Garantir que o nome seja exibido corretamente
  const displayName = currentUserName || user?.name || 'Usuário';

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          <button
            onClick={onMenuClick}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Nome do usuário - oculto em telas pequenas */}
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {displayName}
          </span>
          
          {/* Avatar do usuário */}
          <Avatar className="h-8 w-8">
            {savedAvatar && (
              <AvatarImage src={savedAvatar} alt={displayName} />
            )}
            <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Botão de alternância de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDark ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
