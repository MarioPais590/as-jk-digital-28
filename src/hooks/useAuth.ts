import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('financas-jk-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const updateProfile = (name: string, email: string): { success: boolean; message: string } => {
    try {
      // Tentar recuperar o usuário do localStorage se não estiver no estado
      let currentUser = authState.user;
      
      if (!currentUser) {
        const savedUser = localStorage.getItem('financas-jk-user');
        if (savedUser) {
          currentUser = JSON.parse(savedUser);
        }
      }

      if (!currentUser || !currentUser.id) {
        return { success: false, message: 'Usuário não encontrado. Faça login novamente.' };
      }

      // Validar se nome e email não estão vazios
      if (!name.trim() || !email.trim()) {
        return { success: false, message: 'Nome e e-mail são obrigatórios.' };
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Por favor, insira um e-mail válido.' };
      }

      // Atualizar dados do usuário no localStorage
      const updatedUser = { ...currentUser, name, email };
      localStorage.setItem('financas-jk-user', JSON.stringify(updatedUser));

      // Atualizar lista de usuários também
      const savedUsers = JSON.parse(localStorage.getItem('financas-jk-users') || '[]');
      const userIndex = savedUsers.findIndex((u: any) => u.id === currentUser.id);
      if (userIndex !== -1) {
        savedUsers[userIndex] = { ...savedUsers[userIndex], name, email };
        localStorage.setItem('financas-jk-users', JSON.stringify(savedUsers));
      }

      // Atualizar estado local IMEDIATAMENTE
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isAuthenticated: true
      }));

      // Disparar evento customizado para notificar outros componentes sobre a mudança
      console.log('Disparando evento userProfileUpdated com:', updatedUser);
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
        detail: updatedUser 
      }));

      // Também disparar um evento de mudança no storage como fallback
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'financas-jk-user',
        newValue: JSON.stringify(updatedUser),
        storageArea: localStorage
      }));

      return { success: true, message: 'Perfil atualizado com sucesso!' };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro ao atualizar perfil. Tente novamente.' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Simular validação (em produção, isso seria uma chamada para API)
      const savedUsers = JSON.parse(localStorage.getItem('financas-jk-users') || '[]');
      const user = savedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const userData = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem('financas-jk-user', JSON.stringify(userData));
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, message: 'Login realizado com sucesso!' };
      } else {
        return { success: false, message: 'E-mail ou senha incorretos.' };
      }
    } catch (error) {
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem('financas-jk-users') || '[]');
      
      // Verificar se e-mail já existe
      if (savedUsers.some((u: any) => u.email === email)) {
        return { success: false, message: 'Este e-mail já está cadastrado.' };
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      savedUsers.push(newUser);
      localStorage.setItem('financas-jk-users', JSON.stringify(savedUsers));

      // Fazer login automático
      const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
      localStorage.setItem('financas-jk-user', JSON.stringify(userData));
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      return { success: false, message: 'Erro interno. Tente novamente.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('financas-jk-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };
};
