
import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen, onSidebarToggle }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // Safe auth hook usage with error boundary
  let user = null;
  let signOut = null;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    signOut = authContext.signOut;
  } catch (error) {
    console.log('Auth context not available yet');
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Load user profile data and avatar
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('nome, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao carregar perfil:', error);
          // Fallback to user metadata or email
          setCurrentUserName(user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário');
          // Load avatar from localStorage as fallback
          const localAvatar = localStorage.getItem('financas-jk-user-avatar');
          setSavedAvatar(localAvatar);
        } else if (data) {
          setCurrentUserName(data.nome || user.email?.split('@')[0] || 'Usuário');
          if (data.avatar_url) {
            setSavedAvatar(data.avatar_url);
            localStorage.setItem('financas-jk-user-avatar', data.avatar_url);
          } else {
            // Load from localStorage if Supabase doesn't have avatar
            const localAvatar = localStorage.getItem('financas-jk-user-avatar');
            setSavedAvatar(localAvatar);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setCurrentUserName(user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário');
        // Load avatar from localStorage as fallback
        const localAvatar = localStorage.getItem('financas-jk-user-avatar');
        setSavedAvatar(localAvatar);
      }
    };

    loadUserData();

    // Listen for storage changes (avatar updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'financas-jk-user-avatar') {
        setSavedAvatar(e.newValue);
      }
    };

    // Listen for custom storage events
    const handleCustomStorageChange = () => {
      const avatar = localStorage.getItem('financas-jk-user-avatar');
      setSavedAvatar(avatar);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageChange);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut();
        toast.success('Logout realizado com sucesso!');
        navigate('/welcome');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  // Simple avatar component to avoid Radix UI issues
  const SimpleAvatar = ({ src, alt, fallback }: { src?: string | null; alt?: string; fallback: string }) => (
    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium overflow-hidden">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover rounded-full" />
      ) : (
        fallback
      )}
    </div>
  );

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          {/* Desktop sidebar toggle button - restaurado com ícone de hambúrguer */}
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Nome do usuário - oculto em telas pequenas */}
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentUserName}
          </span>
          
          {/* Avatar do usuário */}
          <SimpleAvatar 
            src={savedAvatar} 
            alt={currentUserName} 
            fallback={currentUserName.charAt(0).toUpperCase()}
          />

          {/* Botão de logout - Only visible on desktop */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Sair"
          >
            <LogOut size={16} />
          </Button>

          {/* Botão de alternância de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isDark ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
